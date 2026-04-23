import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import {
  ENV,
  adminGoogleEmails,
  isGoogleAuthConfigured,
  isOAuthConfigured,
} from "./env";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

const GOOGLE_STATE_COOKIE = "lumina_google_state";
const GOOGLE_SCOPES = ["openid", "email", "profile"].join(" ");
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

function getRequestOrigin(req: Request) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto?.split(",")[0]?.trim() || req.protocol;

  return `${proto}://${req.get("host")}`;
}

function getGoogleRedirectUri(req: Request) {
  return new URL("/api/auth/google/callback", getRequestOrigin(req)).toString();
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/auth/google/start", async (req: Request, res: Response) => {
    if (!isGoogleAuthConfigured) {
      res.status(503).json({ error: "Google auth is not configured on this server" });
      return;
    }

    const state = randomBytes(24).toString("hex");
    const cookieOptions = getSessionCookieOptions(req);

    res.cookie(GOOGLE_STATE_COOKIE, state, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 10,
    });

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", ENV.googleClientId);
    authUrl.searchParams.set("redirect_uri", getGoogleRedirectUri(req));
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", GOOGLE_SCOPES);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("prompt", "select_account");

    res.redirect(302, authUrl.toString());
  });

  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    if (!isGoogleAuthConfigured) {
      res.status(503).json({ error: "Google auth is not configured on this server" });
      return;
    }

    const state = getQueryParam(req, "state");
    const code = getQueryParam(req, "code");
    const stateCookie = req.headers.cookie
      ?.split(";")
      .map(part => part.trim())
      .find(part => part.startsWith(`${GOOGLE_STATE_COOKIE}=`))
      ?.split("=")[1];

    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(GOOGLE_STATE_COOKIE, {
      ...cookieOptions,
    });

    if (!code || !state || !stateCookie || state !== stateCookie) {
      res.status(400).json({ error: "Invalid Google OAuth state" });
      return;
    }

    try {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: ENV.googleClientId,
          client_secret: ENV.googleClientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: getGoogleRedirectUri(req),
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Google token exchange failed: ${errorText}`);
      }

      const tokenData = (await tokenResponse.json()) as {
        id_token?: string;
      };

      if (!tokenData.id_token) {
        throw new Error("Google token response missing id_token");
      }

      const verification = await jwtVerify(tokenData.id_token, GOOGLE_JWKS, {
        audience: ENV.googleClientId,
        issuer: ["https://accounts.google.com", "accounts.google.com"],
      });

      const email = typeof verification.payload.email === "string"
        ? verification.payload.email.toLowerCase()
        : null;
      const name = typeof verification.payload.name === "string"
        ? verification.payload.name
        : "Google User";
      const sub = typeof verification.payload.sub === "string"
        ? verification.payload.sub
        : null;
      const emailVerified = verification.payload.email_verified === true;

      if (!sub || !email || !emailVerified) {
        throw new Error("Google account is missing a verified email address");
      }

      const isAdminEmail = adminGoogleEmails.includes(email);

      await db.upsertUser({
        openId: `google:${sub}`,
        name,
        email,
        loginMethod: "google",
        role: isAdminEmail ? "admin" : undefined,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(`google:${sub}`, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, "/admin");
    } catch (error) {
      console.error("[Google OAuth] Callback failed", error);
      res.status(500).json({ error: "Google OAuth callback failed" });
    }
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    if (!isOAuthConfigured) {
      res.status(503).json({ error: "OAuth is not configured on this server" });
      return;
    }

    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

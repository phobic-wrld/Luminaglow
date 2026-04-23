export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const getOAuthPortalUrl = () => {
  const rawValue = import.meta.env.VITE_OAUTH_PORTAL_URL?.trim();

  if (!rawValue || rawValue === "undefined" || rawValue.includes("%")) {
    return null;
  }

  try {
    return new URL(rawValue).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
};

export const isOAuthEnabled = Boolean(
  getOAuthPortalUrl() && import.meta.env.VITE_APP_ID?.trim()
);

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = getOAuthPortalUrl();
  const appId = import.meta.env.VITE_APP_ID?.trim();

  if (!oauthPortalUrl || !appId) {
    return null;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  const url = new URL("/app-auth", `${oauthPortalUrl}/`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

export const getGoogleLoginUrl = () => "/api/auth/google/start";

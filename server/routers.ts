import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  ENV,
  isGoogleAuthConfigured,
  isLocalAdminConfigured,
  isOAuthConfigured,
  localAdminOpenId,
} from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllPerfumes,
  getPerfumesByCategory,
  getPerfumeById,
  insertPerfume,
  updatePerfume,
  deletePerfume,
} from "./db";
import { sdk } from "./_core/sdk";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const perfumeInput = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  category: z.enum(["women", "men", "unisex"]),
  type: z.enum(["arabic", "designer"]),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  inStock: z.number().int().default(1),
  isNewArrival: z.number().int().default(0),
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    providers: publicProcedure.query(() => ({
      oauthEnabled: isOAuthConfigured,
      localAdminEnabled: isLocalAdminConfigured,
      googleEnabled: isGoogleAuthConfigured,
    })),
    me: publicProcedure.query((opts) => opts.ctx.user),
    loginLocal: publicProcedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!isLocalAdminConfigured) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Local admin login is not configured",
          });
        }

        if (
          input.username !== ENV.localAdminUsername ||
          input.password !== ENV.localAdminPassword
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid admin credentials",
          });
        }

        const sessionToken = await sdk.createSessionToken(localAdminOpenId, {
          name: ENV.localAdminUsername || "Admin",
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, cookieOptions);
      return { success: true } as const;
    }),
  }),

  perfumes: router({
    list: publicProcedure.query(async () => {
      return getAllPerfumes();
    }),

    listByCategory: publicProcedure
      .input(z.object({ category: z.enum(["women", "men", "unisex"]) }))
      .query(async ({ input }) => {
        return getPerfumesByCategory(input.category);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const perfume = await getPerfumeById(input.id);
        if (!perfume) throw new TRPCError({ code: "NOT_FOUND" });
        return perfume;
      }),

    create: adminProcedure
      .input(perfumeInput)
      .mutation(async ({ input }) => {
        const id = await insertPerfume({
          name: input.name,
          description: input.description ?? null,
          price: input.price,
          category: input.category,
          type: input.type,
          imageUrl: input.imageUrl ?? null,
          imageKey: input.imageKey ?? null,
          inStock: input.inStock,
        });
        return { id };
      }),

    update: adminProcedure
      .input(z.object({ id: z.number(), data: perfumeInput.partial() }))
      .mutation(async ({ input }) => {
        await updatePerfume(input.id, input.data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePerfume(input.id);
        return { success: true };
      }),

    uploadImage: adminProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          dataUrl: z.string(), // base64 data URL
        })
      )
      .mutation(async ({ input }) => {
        const base64Data = input.dataUrl.split(",")[1];
        if (!base64Data) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid image data" });
        const buffer = Buffer.from(base64Data, "base64");
        const ext = input.filename.split(".").pop() || "jpg";
        const key = `perfumes/${nanoid()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),

    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        const allPerfumes = await getAllPerfumes();
        const lowerQuery = input.query.toLowerCase();
        return allPerfumes.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery))
        );
      }),

    getNewArrivals: publicProcedure.query(async () => {
      const allPerfumes = await getAllPerfumes();
      return allPerfumes.filter((p) => p.isNewArrival === 1).slice(0, 8);
    }),
  }),
});

export type AppRouter = typeof appRouter;

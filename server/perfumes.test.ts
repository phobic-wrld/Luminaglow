import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  getAllPerfumes: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Oud Al Layl",
      description: "A rich oriental fragrance",
      price: "120.00",
      category: "unisex",
      type: "arabic",
      imageUrl: null,
      imageKey: null,
      inStock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getPerfumesByCategory: vi.fn().mockResolvedValue([]),
  getPerfumeById: vi.fn().mockResolvedValue(undefined),
  insertPerfume: vi.fn().mockResolvedValue(1),
  updatePerfume: vi.fn().mockResolvedValue(undefined),
  deletePerfume: vi.fn().mockResolvedValue(undefined),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/test.jpg", key: "perfumes/test.jpg" }),
}));

function makeCtx(role: "admin" | "user" | null = null): TrpcContext {
  const user = role
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "glow",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("perfumes.list", () => {
  it("returns perfumes for public users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.perfumes.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe("Oud Al Layl");
  });
});

describe("perfumes.listByCategory", () => {
  it("filters by category", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.perfumes.listByCategory({ category: "women" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("perfumes.create (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.perfumes.create({
        name: "Test Perfume",
        price: "50.00",
        category: "women",
        type: "designer",
        inStock: 1,
      })
    ).rejects.toThrow();
  });

  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.perfumes.create({
        name: "Test Perfume",
        price: "50.00",
        category: "women",
        type: "designer",
        inStock: 1,
      })
    ).rejects.toThrow();
  });

  it("allows admin to create a perfume", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.perfumes.create({
      name: "Rose Noir",
      price: "89.99",
      category: "women",
      type: "designer",
      inStock: 1,
    });
    expect(result).toHaveProperty("id");
  });
});

describe("perfumes.delete (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.perfumes.delete({ id: 1 })).rejects.toThrow();
  });

  it("allows admin to delete", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.perfumes.delete({ id: 1 });
    expect(result.success).toBe(true);
  });
});

describe("auth.logout", () => {
  it("clears session cookie", async () => {
    const ctx = makeCtx("user");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});

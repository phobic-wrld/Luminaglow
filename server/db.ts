import "dotenv/config";
import mysql from "mysql2";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { perfumes, users, type InsertPerfume, type InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let pool: mysql.Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;

function parseDatabaseUrl(connectionString: string) {
  const databaseUrl = new URL(connectionString);

  return {
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || "3306"),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.replace(/^\//, ""),
    ssl:
      databaseUrl.protocol === "mysqls:"
        ? { rejectUnauthorized: false }
        : undefined,
  };
}

export async function getDb() {
  if (db) return db;

  if (!ENV.databaseUrl) {
    throw new Error("DATABASE_URL missing");
  }

  const config = parseDatabaseUrl(ENV.databaseUrl);

  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
  });

  db = drizzle(pool);

  return db;
}

function hasOwn<T extends object, K extends PropertyKey>(
  value: T,
  key: K
): value is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export async function getUserByOpenId(openId: string) {
  const database = await getDb();
  const [user] = await database.select().from(users).where(eq(users.openId, openId)).limit(1);
  return user ?? null;
}

type UpsertUserInput = Pick<InsertUser, "openId"> & Partial<Omit<InsertUser, "openId">>;

export async function upsertUser(input: UpsertUserInput) {
  const database = await getDb();

  const values: InsertUser = {
    openId: input.openId,
    ...(hasOwn(input, "name") ? { name: input.name ?? null } : {}),
    ...(hasOwn(input, "email") ? { email: input.email ?? null } : {}),
    ...(hasOwn(input, "loginMethod")
      ? { loginMethod: input.loginMethod ?? null }
      : {}),
    ...(hasOwn(input, "role") && input.role ? { role: input.role } : {}),
    ...(hasOwn(input, "lastSignedIn") && input.lastSignedIn
      ? { lastSignedIn: input.lastSignedIn }
      : {}),
  };

  const updateSet: Partial<InsertUser> = {
    updatedAt: new Date(),
  };

  if (hasOwn(input, "name")) updateSet.name = input.name ?? null;
  if (hasOwn(input, "email")) updateSet.email = input.email ?? null;
  if (hasOwn(input, "loginMethod")) updateSet.loginMethod = input.loginMethod ?? null;
  if (hasOwn(input, "role") && input.role) updateSet.role = input.role;
  if (hasOwn(input, "lastSignedIn") && input.lastSignedIn) {
    updateSet.lastSignedIn = input.lastSignedIn;
  }

  await database
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });

  return getUserByOpenId(input.openId);
}

export async function getAllPerfumes() {
  const database = await getDb();
  return database.select().from(perfumes).orderBy(desc(perfumes.createdAt), desc(perfumes.id));
}

export async function getPerfumesByCategory(
  category: InsertPerfume["category"]
) {
  const database = await getDb();
  return database
    .select()
    .from(perfumes)
    .where(eq(perfumes.category, category))
    .orderBy(desc(perfumes.createdAt), desc(perfumes.id));
}

export async function getPerfumeById(id: number) {
  const database = await getDb();
  const [perfume] = await database.select().from(perfumes).where(eq(perfumes.id, id)).limit(1);
  return perfume ?? null;
}

type CreatePerfumeInput = Omit<InsertPerfume, "id" | "createdAt" | "updatedAt">;

export async function insertPerfume(input: CreatePerfumeInput) {
  const database = await getDb();
  const [created] = await database.insert(perfumes).values(input).$returningId();

  if (!created?.id) {
    throw new Error("Failed to insert perfume");
  }

  return created.id;
}

type UpdatePerfumeInput = Partial<CreatePerfumeInput>;

export async function updatePerfume(id: number, input: UpdatePerfumeInput) {
  const database = await getDb();

  const updateSet: Partial<InsertPerfume> = {
    updatedAt: new Date(),
  };

  if (hasOwn(input, "name") && input.name !== undefined) updateSet.name = input.name;
  if (hasOwn(input, "description")) updateSet.description = input.description ?? null;
  if (hasOwn(input, "price") && input.price !== undefined) updateSet.price = input.price;
  if (hasOwn(input, "category") && input.category !== undefined) updateSet.category = input.category;
  if (hasOwn(input, "type") && input.type !== undefined) updateSet.type = input.type;
  if (hasOwn(input, "imageUrl")) updateSet.imageUrl = input.imageUrl ?? null;
  if (hasOwn(input, "imageKey")) updateSet.imageKey = input.imageKey ?? null;
  if (hasOwn(input, "inStock") && input.inStock !== undefined) updateSet.inStock = input.inStock;
  if (hasOwn(input, "isNewArrival") && input.isNewArrival !== undefined) {
    updateSet.isNewArrival = input.isNewArrival;
  }

  await database.update(perfumes).set(updateSet).where(eq(perfumes.id, id));
}

export async function deletePerfume(id: number) {
  const database = await getDb();
  await database.delete(perfumes).where(eq(perfumes.id, id));
}

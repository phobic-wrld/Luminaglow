import "dotenv/config";
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { perfumes, users, type InsertPerfume, type InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;
let dbInitPromise: Promise<ReturnType<typeof drizzle>> | undefined;

function parseDatabaseUrl(connectionString: string) {
  const databaseUrl = new URL(connectionString);
  const sslMode = databaseUrl.searchParams.get("ssl-mode")?.toUpperCase();
  const requiresSsl = databaseUrl.protocol === "mysqls:" || sslMode === "REQUIRED";

  return {
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || "3306"),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.replace(/^\//, ""),
    ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  };
}

export async function getDb() {
  if (db) return db;
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
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
    await ensureCoreSchema(pool, config.database);
    return db;
  })().catch((error) => {
    dbInitPromise = undefined;
    throw error;
  });

  return dbInitPromise;
}

async function ensureCoreSchema(connection: Pool, databaseName: string) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`openId\` varchar(64) NOT NULL,
      \`name\` text,
      \`email\` varchar(320),
      \`loginMethod\` varchar(64),
      \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
      \`createdAt\` timestamp NOT NULL DEFAULT (now()),
      \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
      \`lastSignedIn\` timestamp NOT NULL DEFAULT (now()),
      CONSTRAINT \`users_id\` PRIMARY KEY(\`id\`),
      CONSTRAINT \`users_openId_unique\` UNIQUE(\`openId\`)
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`perfumes\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`name\` varchar(255) NOT NULL,
      \`description\` text,
      \`price\` decimal(10,2) NOT NULL,
      \`category\` enum('women','men','unisex') NOT NULL,
      \`type\` enum('arabic','designer') NOT NULL,
      \`imageUrl\` text,
      \`imageKey\` varchar(512),
      \`inStock\` int NOT NULL DEFAULT 1,
      \`isNewArrival\` int NOT NULL DEFAULT 0,
      \`createdAt\` timestamp NOT NULL DEFAULT (now()),
      \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT \`perfumes_id\` PRIMARY KEY(\`id\`)
    )
  `);

  const [columnRows] = await connection.query<RowDataPacket[]>(
    `
      SELECT 1 AS present
      FROM information_schema.columns
      WHERE table_schema = ?
        AND table_name = 'perfumes'
        AND column_name = 'isNewArrival'
      LIMIT 1
    `,
    [databaseName]
  );

  if (columnRows.length === 0) {
    await connection.execute(
      "ALTER TABLE `perfumes` ADD COLUMN `isNewArrival` int NOT NULL DEFAULT 0"
    );
  }
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
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO \`perfumes\` (
        \`name\`,
        \`description\`,
        \`price\`,
        \`category\`,
        \`type\`,
        \`imageUrl\`,
        \`imageKey\`,
        \`inStock\`,
        \`isNewArrival\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.name,
      input.description ?? null,
      input.price,
      input.category,
      input.type,
      input.imageUrl ?? null,
      input.imageKey ?? null,
      input.inStock ?? 1,
      input.isNewArrival ?? 0,
    ]
  );

  if (!result.insertId) {
    throw new Error("Failed to insert perfume");
  }

  return result.insertId;
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

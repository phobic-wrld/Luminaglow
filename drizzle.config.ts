import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ override: true });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

const databaseUrl = new URL(connectionString);
const host = databaseUrl.hostname;
const port = Number(databaseUrl.port || "3306");
const user = decodeURIComponent(databaseUrl.username);
const password = decodeURIComponent(databaseUrl.password);
const database = databaseUrl.pathname.replace(/^\//, "");

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host,
    port,
    user,
    password,
    database,
  },
});

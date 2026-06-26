import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const root = process.cwd();

dotenv.config({ path: path.resolve(root, ".env.local") });
dotenv.config({ path: path.resolve(root, ".env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Ensure .env or .env.local contains the connection string."
  );
}

const dbUrl = new URL(databaseUrl);

const dbAdapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port) : 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  connectTimeout: 10000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prismaClient = new PrismaClient({ adapter: dbAdapter });

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

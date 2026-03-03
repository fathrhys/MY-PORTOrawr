import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL belum ada di .env");

const u = new URL(dbUrl);

// ambil info dari DATABASE_URL
const host = u.hostname || "localhost";
const port = Number(u.port || "3306");
const user = decodeURIComponent(u.username || "root");
const password = decodeURIComponent(u.password || "");
const database = u.pathname.replace("/", "") || "porto_v2";

// Adapter Prisma v7 (MySQL/MariaDB)
const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 5,
});

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

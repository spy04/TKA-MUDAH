import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prismaAdapter?: PrismaPg;
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;

const adapter =
  databaseUrl
    ? globalForPrisma.prismaAdapter ??
      new PrismaPg({ connectionString: databaseUrl })
    : null;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter ?? undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  if (adapter) {
    globalForPrisma.prismaAdapter = adapter;
  }
  globalForPrisma.prisma = prisma;
}

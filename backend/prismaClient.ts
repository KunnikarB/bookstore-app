
import * as Prisma from '@prisma/client';
const PrismaClient = (Prisma as any).PrismaClient;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// prisma.ts
import PrismaPkg from '@prisma/client';
const { PrismaClient } = PrismaPkg;

const prisma = new PrismaClient({
  datasources: { db: { url: 'mongodb://localhost:27017/bookstore' } },
});

export default prisma;

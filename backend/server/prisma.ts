import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

// Handle connection errors gracefully
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

// Ensure connection is established before exiting
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;

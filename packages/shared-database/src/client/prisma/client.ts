import { PrismaClient } from '@prisma/shared-database/client';

export const prisma = new PrismaClient({
  // log: ['query'],
});

export * from '@prisma/shared-database/client';

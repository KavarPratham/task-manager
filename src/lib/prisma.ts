// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Allow globalThis.prisma to be PrismaClient or undefined
  /* eslint-disable-next-line no-var */
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prisma ?? new PrismaClient({ log: ['query'] });

// In development, preserve the client across module reloads
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

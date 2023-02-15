import { PrismaClient } from '@prisma/client';

export let client;

if (typeof window === 'undefined') {
  if (process.env['NODE_ENV'] === 'production') {
    client = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    client = global.prisma;
  }
}

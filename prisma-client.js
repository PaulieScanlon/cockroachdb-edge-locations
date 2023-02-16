const { PrismaClient, Prisma } = require('@prisma/client');

const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

module.exports = {
  client,
  Prisma
};

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const test_date_1 = await prisma.locations.create({
    data: {
      date: new Date(),
      location: 'null'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

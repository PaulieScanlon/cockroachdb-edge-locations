const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const test_location_1 = await prisma.locations.create({
    data: {
      date: new Date(),
      city: 'Test',
      lat: 0,
      lng: 0
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

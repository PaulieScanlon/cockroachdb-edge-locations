// const { PrismaClient } = require('@prisma/client');
const { client } = require('../prisma-client');

async function main() {
  await client.locations.create({
    data: {
      date: new Date(),
      city: '...',
      lat: 0.0,
      lng: -0.0
      // runtime: ''
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

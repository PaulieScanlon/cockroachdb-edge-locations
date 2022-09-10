const { PrismaClient } = require('@prisma/client');

export default async function handler(req, res) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    const response = await prisma.locations.findMany();

    //   throw new Error('Error');

    res.status(200).json({
      message: 'A-OK!',
      data: {
        locations: JSON.stringify(response, (_key, value) =>
          // need to add a custom serializer because CockroachDB IDs map to
          // JavaScript BigInts, which JSON.stringify has trouble serializing.
          typeof value === 'bigint' ? value.toString() : value
        )
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error!' });
  }
}

const { PrismaClient, Prisma } = require('@prisma/client');

export default async function handler(req, res) {
  const { id } = JSON.parse(req.body);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    const response = await prisma.locations.delete({
      where: {
        id: BigInt(id)
      }
    });

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id: id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error!' });
  } finally {
    prisma.$disconnect();
  }
}

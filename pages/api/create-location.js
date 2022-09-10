const { PrismaClient } = require('@prisma/client');
const requestIp = require('request-ip');
const geoip = require('fast-geoip');

export default async function handler(req, res) {
  const { date } = JSON.parse(req.body);
  console.log('date: ', date);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    const ip = await requestIp.getClientIp(req);
    const geo = await geoip.lookup(ip);

    const response = await prisma.dates.create({
      data: {
        date: new Date(date),
        location: geo
      }
    });

    // throw new Error('Error');

    res.status(200).json({
      message: 'A-OK!',
      data: {
        date: new Date(date).toLocaleString(),
        location: geo
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  } finally {
    prisma.$disconnect();
  }
}

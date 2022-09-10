const { PrismaClient } = require('@prisma/client');
const requestIp = require('request-ip');
const geoip = require('fast-geoip');

// range: [1523687424, 1523688448],
// country: 'GB',
// region: 'ENG',
// eu: '0',
// timezone: 'Europe/London',
// city: 'Peacehaven',
// ll: [50.7912, -0.0054]
// metro: 0,
// area: 20

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

    const response = await prisma.locations.create({
      data: {
        date: new Date(date),
        city: geo ? geo.city : 'Test',
        lat: geo ? geo.ll[0] : 0,
        lng: geo ? geo.ll[1] : 0
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

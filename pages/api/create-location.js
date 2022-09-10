const { PrismaClient, Prisma } = require('@prisma/client');
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

const setAsPrismaDecimal = (n) => {
  return new Prisma.Decimal(n);
};

export default async function handler(req, res) {
  const { date } = JSON.parse(req.body);

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
        lat: geo ? setAsPrismaDecimal(geo.ll[0]) : setAsPrismaDecimal(0.123),
        lng: geo ? setAsPrismaDecimal(geo.ll[1]) : setAsPrismaDecimal(-0.123)
      }
    });

    // throw new Error('Error');

    res.status(200).json({
      message: 'A-OK!',
      data: {
        date: new Date(date).toLocaleString(),
        location: geo,
        response: JSON.stringify(response, (_key, value) =>
          // need to add a custom serializer because CockroachDB IDs map to
          // JavaScript BigInts, which JSON.stringify has trouble serializing.
          typeof value === 'bigint' ? value.toString() : value
        )
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  } finally {
    prisma.$disconnect();
  }
}

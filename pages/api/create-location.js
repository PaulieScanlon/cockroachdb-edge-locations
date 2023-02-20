const { client, Prisma } = require('../../prisma-client');

const requestIp = require('request-ip');
const geoip = require('fast-geoip');

const setAsPrismaDecimal = (n) => {
  return new Prisma.Decimal(n);
};

export default async function handler(req, res) {
  const { date } = JSON.parse(req.body);

  try {
    const ip = await requestIp.getClientIp(req);
    const geo = await geoip.lookup(ip);

    const _date = new Date(date);
    const city = geo ? geo.city : 'Uluru-Kata Tjuta National Park';
    const lat = geo ? setAsPrismaDecimal(geo.ll[0]) : setAsPrismaDecimal(-25.34449);
    const lng = geo ? setAsPrismaDecimal(geo.ll[1]) : setAsPrismaDecimal(131.0369);

    const response = await client.locations.create({
      data: {
        date: _date,
        city: city,
        lat: lat,
        lng: lng,
        runtime: 'serverless'
      }
    });

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id: JSON.stringify(response.id, (_key, value) => (typeof value === 'bigint' ? value.toString() : value)),
        city: city,
        date: date,
        lat: lat,
        lng: lng
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  } finally {
    client.$disconnect();
  }
}

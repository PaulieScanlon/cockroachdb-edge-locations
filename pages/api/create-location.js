import { getDB } from '../../db';

import requestIp from 'request-ip';
import geoip from 'fast-geoip';

export default async function handler(req, res) {
  const { db } = getDB();
  const { date } = JSON.parse(req.body);

  try {
    const ip = await requestIp.getClientIp(req);
    const geo = await geoip.lookup(ip);

    const _date = new Date(date);
    const city = geo ? geo.city : 'Uluru-Kata Tjuta National Park';
    const lat = geo ? geo.ll[0] : -25.34449;
    const lng = geo ? geo.ll[1] : 131.0369;

    const response = await db.one(
      'INSERT INTO locations (date, city, lat, lng, runtime) VALUES(${date}, ${city}, ${lat}, ${lng}, ${serverless}) RETURNING id',
      {
        date: _date,
        city: city,
        lat: lat,
        lng: lng,
        serverless: 'serverless'
      }
    );

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id: response.id,
        city: city,
        date: date,
        lat: lat,
        lng: lng
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  }
}

import { getDB } from '../../pg';

import requestIp from 'request-ip';
import geoip from 'fast-geoip';

export default async function handler(req, res) {
  const client = await getDB().connect();
  const { date } = JSON.parse(req.body);

  try {
    const ip = await requestIp.getClientIp(req);
    const geo = await geoip.lookup(ip);

    const _date = new Date(date);
    const city = geo ? geo.city : 'Uluru-Kata Tjuta National Park';
    const lat = geo ? geo.ll[0] : -25.34449;
    const lng = geo ? geo.ll[1] : 131.0369;
    const runtime = 'serverless';

    const response = await client.query(
      'INSERT INTO locations (date, city, lat, lng, runtime) VALUES($1, $2, $3, $4, $5) RETURNING id',
      [_date, city, lat, lng, runtime]
    );

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id: response.rows[0].id,
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
    client.release();
  }
}

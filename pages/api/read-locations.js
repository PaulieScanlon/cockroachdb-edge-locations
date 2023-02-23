import { getDB } from '../../db';

export default async function handler(req, res) {
  const { db } = getDB();

  const response = await db.any('SELECT * from locations');

  res.status(200).json({
    message: 'A Ok!',
    data: {
      locations: response || []
    }
  });
}

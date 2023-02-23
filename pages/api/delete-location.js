import { getDB } from '../../db';

export default async function handler(req, res) {
  const { db } = getDB();
  const { id } = JSON.parse(req.body);

  try {
    await db.none('DELETE FROM locations WHERE id = $1', id);

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  }
}

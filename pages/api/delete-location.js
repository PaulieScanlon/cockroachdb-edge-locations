import { getDB } from '../../pg';

export default async function handler(req, res) {
  const client = await getDB().connect();
  const { id } = JSON.parse(req.body);

  try {
    await client.query('DELETE FROM locations WHERE id = $1', [id]);

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  } finally {
    client.release();
  }
}

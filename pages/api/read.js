import { getDB } from '../../pg';

export default async function handler(req, res) {
  const client = await getDB().connect();

  try {
    const response = await client.query('SELECT * from locations');

    res.status(200).json({
      message: 'A Ok!',
      data: {
        locations: response.rows || []
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  } finally {
    client.release();
  }
}

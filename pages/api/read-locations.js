const { client } = require('../../prisma-client');

export default async function handler(req, res) {
  try {
    const response = await client.locations.findMany();

    res.status(200).json({
      message: 'A-OK!',
      data: {
        locations: JSON.stringify(response, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))
      }
    });
  } catch (error) {
    console.log('DATABASE_URL', process.env.DATABASE_URL);
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  }
}

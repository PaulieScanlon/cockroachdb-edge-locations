const client = require('../../prisma-client');

export default async function handler(req, res) {
  const { id } = JSON.parse(req.body);

  try {
    const response = await client.locations.delete({
      where: {
        id: BigInt(id)
      }
    });

    res.status(200).json({
      message: 'A-OK!',
      data: {
        id: id
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error!' });
  } finally {
    client.$disconnect();
  }
}

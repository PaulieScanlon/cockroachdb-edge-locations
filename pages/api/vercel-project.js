export default async function (req, res) {
  try {
    const response = await fetch('https://api.vercel.com/v9/projects/cockroachdb-edge-locations', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error();
    }

    const json = await response.json();

    return res.status(200).json({
      message: 'A-OK!',
      data: json
    });
  } catch (error) {
    res.status(500).json({ message: 'Error!' });
  }
}

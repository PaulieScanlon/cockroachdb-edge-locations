export default async function (req, res) {
  try {
    const response = await fetch(`https://cockroachlabs.cloud/api/v1/clusters/${process.env.COCKROACH_CLUSTER_ID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.COCKROACH_CLOUD_SECRET_KEY}`
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

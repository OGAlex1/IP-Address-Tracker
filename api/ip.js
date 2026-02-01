export default async function handler(req, res) {
  try {
    const { ip, domain } = req.query;

    let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IPIFY_API_KEY}`;

    if (ip) url += `&ipAddress=${ip}`;
    if (domain) url += `&domain=${domain}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

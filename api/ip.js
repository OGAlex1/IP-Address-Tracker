export default async function handler(req, res) {
  try {
    const { ip, domain } = req.query;

    // ✅ Get real client IP from Vercel
    const forwardedFor = req.headers["x-forwarded-for"];
    const clientIP = forwardedFor ? forwardedFor.split(",")[0] : null;

    let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IPIFY_API_KEY}`;

    // Priority:
    // 1. User searched IP
    // 2. User searched domain
    // 3. Real visitor IP (NOT Vercel)
    if (ip) {
      url += `&ipAddress=${ip}`;
    } else if (domain) {
      url += `&domain=${domain}`;
    } else if (clientIP) {
      url += `&ipAddress=${clientIP}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

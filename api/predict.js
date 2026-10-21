export default async function handler(req, res) {
  // Enforce global CORS and POST routing allowances
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing text entry input parameter.' });
  }

  try {
    // Hits the modern, official 2026 Hugging Face Serverless Router
    const response = await fetch("https://huggingface.co", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to connect to the Hugging Face engine cluster." });
  }
}

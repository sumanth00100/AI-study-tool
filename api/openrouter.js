/**
 * Vercel Serverless Function — /api/openrouter
 *
 * Proxies requests to OpenRouter so the API key stays server-side only.
 * Set OPENROUTER_API_KEY in Vercel → Settings → Environment Variables.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(401).json({ error: 'OPENROUTER_API_KEY is not configured on the server' })
  }

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin ?? 'https://ai-study-coach.vercel.app',
        'X-Title': 'AI Study Coach',
      },
      body: JSON.stringify(req.body),
    })

    const data = await upstream.json()
    return res.status(upstream.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

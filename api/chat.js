import { SYSTEM_PROMPT } from './_context.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question } = req.body || {}
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required.' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not set in environment variables.' })

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: question.trim() },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq error:', data)
      return res.status(500).json({ error: `Groq error: ${data?.error?.message || response.statusText}` })
    }

    const answer = data.choices?.[0]?.message?.content
    return res.status(200).json({ answer })
  } catch (err) {
    console.error('API error:', err?.message)
    return res.status(500).json({ error: `Request failed: ${err?.message}` })
  }
}

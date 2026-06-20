import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from './_context.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question } = req.body || {}
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required.' })

  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'API key not configured.' })

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Question: ${question.trim()}`)
    return res.status(200).json({ answer: result.response.text() })
  } catch (err) {
    console.error('Gemini error:', err?.message)
    return res.status(500).json({ error: 'Failed to get a response. Please try again.' })
  }
}

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from './api/_context.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      devApiPlugin(env.GEMINI_API_KEY),
    ],
  }
})

function devApiPlugin(apiKey) {
  // Pre-build the model once so every request reuses it
  let model = null
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    } catch (e) {
      console.warn('[dev-api] Failed to init Gemini model:', e?.message)
    }
  }

  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed.' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
          ;(async () => {
            try {
              const { question } = JSON.parse(body || '{}')
              if (!question?.trim()) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Question is required.' }))
                return
              }

              if (!apiKey) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY missing in .env.local — add it and restart the dev server.' }))
                return
              }

              if (!model) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: 'Gemini model could not be initialised. Check your API key format.' }))
                return
              }

              const result = await model.generateContent(
                `${SYSTEM_PROMPT}\n\nUser Question: ${question.trim()}`
              )
              res.end(JSON.stringify({ answer: result.response.text() }))
            } catch (err) {
              console.error('[dev-api] Error:', err?.message)
              res.statusCode = 500
              res.end(JSON.stringify({ error: err?.message ?? 'Request failed.' }))
            }
          })()
        })
      })
    },
  }
}

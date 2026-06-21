import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { SYSTEM_PROMPT } from './api/_context.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      devApiPlugin(env.GROQ_API_KEY),
    ],
  }
})

function devApiPlugin(apiKey) {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return }
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
                res.end(JSON.stringify({ error: 'GROQ_API_KEY missing in .env.local' }))
                return
              }

              const response = await fetch(GROQ_URL, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.1-8b-instant',
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
                res.statusCode = 500
                res.end(JSON.stringify({ error: `Groq: ${data?.error?.message || 'failed'}` }))
                return
              }

              const answer = data.choices?.[0]?.message?.content
              res.end(JSON.stringify({ answer }))
            } catch (err) {
              console.error('[dev-api]', err?.message)
              res.statusCode = 500
              res.end(JSON.stringify({ error: err?.message ?? 'Request failed.' }))
            }
          })()
        })
      })
    },
  }
}

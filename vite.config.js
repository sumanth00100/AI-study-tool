import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),

      // Proxy middleware: browser → /api/openrouter → openrouter.ai
      // Runs in Node.js — no CORS, key never exposed to browser.
      {
        name: 'openrouter-proxy',
        configureServer(server) {
          server.middlewares.use('/api/openrouter', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            const apiKey = env.OPENROUTER_API_KEY
            if (!apiKey) {
              res.statusCode = 401
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY is not set in .env' }))
              return
            }

            const chunks = []
            req.on('data', (c) => chunks.push(c))
            req.on('end', async () => {
              try {
                const body = Buffer.concat(chunks).toString()

                const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'http://localhost:5173',
                    'X-Title': 'AI Study Coach',
                  },
                  body,
                })

                const data = await upstream.json()
                res.statusCode = upstream.status
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        },
      },
    ],
  }
})

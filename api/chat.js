import { GoogleGenerativeAI } from '@google/generative-ai'

const CONTEXT = `
PORTFOLIO OWNER: M. Dhamotharan
TITLE: Full Stack Web Developer — MERN Stack Developer
EMAIL: mddhamotharan281@gmail.com | PHONE: +91-8072781252 | LOCATION: Tamil Nadu, India
GITHUB: https://github.com/Dhamotharan281
LINKEDIN: https://www.linkedin.com/in/dhamotharan-muthaiyan-3ba50b216/

SUMMARY:
Full Stack Developer specializing in MERN stack and AI-powered web applications. Expert in building
scalable real-time SaaS platforms, responsive UIs with React.js/Next.js, and high-performance backends
with Node.js, Express.js, MongoDB, Redis. Experienced in Generative AI, LLMs, and RAG integration.

STATS: 9+ months experience | 10+ projects | 30+ technologies | 8.4 CGPA (MCA)

SKILLS:
Languages: JavaScript (ES6+), TypeScript, Python, SQL
Frontend: React.js 92%, Next.js 85%, Redux Toolkit 82%, Tailwind CSS 88%, HTML5/CSS3
Backend: Node.js 88%, Express.js 88%, REST APIs 90%, GraphQL 72%, Socket.IO 85%, JWT Auth 83%
Databases: MongoDB 88%, MySQL 72%, Redis 80%
Cloud/DevOps: Docker 78%, AWS 72%, Apache Kafka 75%, Git/GitHub 88%
AI & Data: Gemini AI 78%, RAG/LangChain 70%, Pandas/NumPy 72%, Scikit-Learn 68%

PROJECTS:
1. AI Incident Management Platform — AI DevOps monitoring using Next.js, Node.js, MongoDB, Redis, Kafka, Gemini AI, RAG
2. PawSign — AI sign language pet healthcare booking using MERN, Python, MediaPipe, Computer Vision
   GitHub: https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-
3. Enterprise Multi-Tenant Collaboration SaaS — No-code workspace platform using Next.js, Node.js, MongoDB, Redis, Kafka, Socket.IO, React Native, RAG
4. DataForge — AI data analytics platform using React.js, Python, Flask, Gemini AI, RAG, LangChain, Pandas
   GitHub: https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-
5. Real-Time Chat Platform — WebRTC audio/video, Redis presence, JWT/RBAC, React Native app
6. MediCare AI — Hospital management with Gemini AI booking, WebRTC video calls, admin dashboard
7. Spotify Clone — Music streaming app using React.js, Node.js, MongoDB, Tailwind CSS

EXPERIENCE:
1. Software Developer at HEPL, Tamil Nadu (Apr 2025 – Present | Full-time)
   Building multi-tenant SaaS, real-time chat/messaging, Kafka event-driven services, RAG AI assistant, React Native app features

2. MERN Stack Developer Intern at HEPL (Dec 2024 – Mar 2025)
   Full-stack apps with React/Node/MongoDB, JWT/RBAC auth, API optimization

3. Python Full Stack Developer Intern at Inmakes Info Tech (Sep 2024 – Nov 2024)
   Django + React apps, RESTful APIs, relational databases, e-commerce features

EDUCATION:
MCA — Rajiv Gandhi College of Engineering & Technology, Puducherry (2022–2024) | CGPA: 8.4/10
BCA — Achariya Arts & Science College, Puducherry (2019–2022) | CGPA: 7.5/10

CERTIFICATIONS:
AWS Solutions Architecture (Forage), Deloitte Cyber Security (Forage),
Google Cloud Platform – Website Deployment (Google), Python Data Science (360DigiTMG),
Java Full Stack Development (Greens Technology)
`.trim()

const SYSTEM_PROMPT = `You are an AI assistant for M. Dhamotharan's portfolio website.
Answer ONLY from the portfolio data below. Be friendly, concise, and professional.
Refer to him in third person (e.g. "Dhamotharan has..." or "He worked on...").
If a question is unrelated to his portfolio, say: "I can only answer questions about Dhamotharan's portfolio!"
Keep answers under 150 words unless the user asks for more detail.

PORTFOLIO DATA:
${CONTEXT}`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question } = req.body || {}
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required.' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not set in environment variables.' })

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Question: ${question.trim()}`)
    return res.status(200).json({ answer: result.response.text() })
  } catch (err) {
    console.error('Gemini error:', err?.message)
    // Return actual error so user can see what's wrong
    return res.status(500).json({ error: `Gemini error: ${err?.message || 'Unknown error'}` })
  }
}

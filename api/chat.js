import { GoogleGenerativeAI } from '@google/generative-ai'

const PORTFOLIO_CONTEXT = `
PORTFOLIO OWNER: M. Dhamotharan
TITLE: Software Engineer | Full Stack Developer | AI Enthusiast
EMAIL: mddhamotharan281@gmail.com
PHONE: +91-8072781252
LOCATION: Tamil Nadu, India
GITHUB: https://github.com/Dhamotharan281
LINKEDIN: https://www.linkedin.com/in/dhamotharan-muthaiyan-3ba50b216/

PROFESSIONAL SUMMARY:
Software Engineer with hands-on experience in Full Stack Development, AI-powered applications,
and cloud-native systems. Skilled in MERN Stack, React Native, Python, MongoDB, Redis, Kafka,
and Docker. Experienced in building scalable SaaS platforms, real-time communication systems,
REST APIs, and Retrieval-Augmented Generation (RAG) based AI solutions. Strong foundation in
software engineering principles, problem-solving, and modern web technologies.

STATISTICS:
- 8+ months of professional experience
- 10+ projects built
- 30+ technologies mastered
- 8.4/10 CGPA (MCA)

SKILLS:
Languages: JavaScript (ES6+) - 90%, TypeScript - 80%, Python - 75%, SQL - 70%
Frontend: React.js - 92%, Next.js - 85%, Redux Toolkit - 82%, Tailwind CSS - 88%, HTML5 - 90%, CSS3 - 88%
Backend: Node.js - 88%, Express.js - 88%, REST APIs - 90%, GraphQL - 72%, Socket.IO - 85%, JWT Auth - 83%
Databases & Cache: MongoDB - 88%, MySQL - 72%, Redis - 80%
Cloud & DevOps: Docker - 78%, AWS - 72%, Apache Kafka - 75%, Git/GitHub - 88%
AI & Data: Gemini AI - 78%, RAG/LangChain - 70%, Pandas/NumPy - 72%, Scikit-Learn - 68%

PROJECTS:

1. PawSign – AI-Powered Sign Language Pet Healthcare Booking (AI Project)
   Description: Accessibility-focused healthcare booking platform enabling speech-impaired users
   to schedule pet appointments using hand gestures. Integrated MediaPipe and computer vision
   models to convert gestures into system commands with high recognition accuracy.
   Technologies: MERN Stack, Python, MediaPipe, Computer Vision, JWT, MongoDB
   GitHub: https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-

2. DataForge – AI-Powered Data Analytics Platform (AI Project)
   Description: Intelligent analytics platform enabling natural language interaction with structured
   datasets. Integrated Gemini AI and RAG for document-based question answering with interactive
   dashboards and forecasting modules for business intelligence.
   Technologies: React.js, Python, Flask, Gemini AI, RAG, LangChain, Pandas, MongoDB
   GitHub: https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-

3. Spotify Clone (Web Project)
   Description: Responsive music streaming application with playlist management and playback
   controls. Implemented reusable React components and modern UI design principles with backend
   APIs for content management and user interactions.
   Technologies: React.js, Node.js, MongoDB, Tailwind CSS, Express.js
   GitHub: https://github.com/Dhamotharan281/Clone-Spotify

4. Multi-Tenant No-Code SaaS Platform (Web Project)
   Description: Architected a multi-tenant no-code SaaS platform enabling businesses to build
   custom workspaces. Features tenant isolation, schema-per-tenant MongoDB strategy, real-time
   chat via Kafka + Socket.IO, and Redis caching.
   Technologies: Next.js, Node.js, MongoDB, Redis, Kafka, Docker, Socket.IO, React Native
   Live: https://dhamotharan.netlify.app

5. Real-Time Chat Platform (Web Project)
   Description: Full-stack real-time communication platform with persistent chat, WebRTC audio/
   video calling, and online presence tracking via Redis. JWT auth with RBAC and cross-platform
   React Native mobile app.
   Technologies: React.js, Node.js, Socket.IO, WebRTC, Redis, React Native, JWT, MongoDB
   Live: https://splendorous-clafoutis-171e63.netlify.app/

6. MediCare AI – Hospital Management (Web Project)
   Description: AI-powered hospital management system with Gemini AI appointment booking (voice
   + text), WebRTC video calls between doctors and patients, and a role-based admin dashboard.
   Technologies: React.js, Node.js, MongoDB, Gemini AI, WebRTC, Socket.IO, Express.js

WORK EXPERIENCE:

1. Junior Full Stack Developer at HEPL (Apr 2025 – Present | Full-time | Tamil Nadu)
   - Developing a multi-tenant SaaS platform using Next.js, Node.js, MongoDB, Redis, and Kafka
   - Built real-time workspace communication modules using Socket.IO and Apache Kafka
   - Implemented Redis caching and Pub/Sub mechanisms to optimize application scalability
   - Developing AI-powered RAG solutions for automated user assistance and knowledge retrieval
   - Containerized services using Docker for streamlined deployment and environment consistency
   - Contributing to React Native mobile applications with authentication and push notifications

2. MERN Stack Developer Intern at HEPL (Dec 2024 – Mar 2025 | Internship | Tamil Nadu)
   - Developed full-stack web applications using React.js, Node.js, Express.js, and MongoDB
   - Implemented secure authentication systems using JWT, Refresh Tokens, and RBAC
   - Optimized backend APIs and database queries to improve response times and efficiency

3. Python Developer Intern at Inmakes Info Tech (Sep 2024 – Nov 2024 | Internship | Remote)
   - Automated data processing workflows using Python, Pandas, and NumPy
   - Built machine learning models for price prediction using Scikit-Learn
   - Performed data cleaning, feature engineering, and model evaluation

EDUCATION:

1. Master of Computer Applications (MCA)
   Institution: Rajiv Gandhi College of Engineering & Technology, Puducherry
   Period: 2022 – 2024
   CGPA: 8.4 / 10

2. Bachelor of Computer Applications (BCA)
   Institution: Achariya Arts & Science College, Puducherry
   Period: 2019 – 2022
   CGPA: 7.5 / 10

CERTIFICATIONS:
- AWS Solutions Architecture Virtual Experience (Forage)
- Deloitte Cyber Security Virtual Experience (Forage)
- Google Cloud Platform – Website Deployment (Google)
- Python Data Science Program (360DigiTMG)
- Java Full Stack Development (Greens Technology)
`

const SYSTEM_PROMPT = `You are an AI assistant embedded in M. Dhamotharan's portfolio website.
Your ONLY job is to answer questions about Dhamotharan based strictly on the portfolio data below.
Rules:
- Answer ONLY from the context provided. Do not invent or guess any information.
- Be friendly, concise, and professional.
- Refer to Dhamotharan in third person (e.g., "Dhamotharan has..." or "He worked on...").
- If the question is not about Dhamotharan or his portfolio, politely say: "I can only answer questions about Dhamotharan's portfolio. Feel free to ask about his skills, projects, or experience!"
- Keep answers under 150 words unless the user asks for details.

PORTFOLIO DATA:
${PORTFOLIO_CONTEXT}`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { question } = req.body || {}
  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question is required.' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured.' })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nUser Question: ${question.trim()}`
    )

    const answer = result.response.text()
    return res.status(200).json({ answer })
  } catch (err) {
    console.error('Gemini error:', err?.message)
    return res.status(500).json({ error: 'Failed to get a response. Please try again.' })
  }
}

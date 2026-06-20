export const PORTFOLIO_CONTEXT = `
PORTFOLIO OWNER: M. Dhamotharan
TITLE: Full Stack Web Developer — MERN Stack Developer
EMAIL: mddhamotharan281@gmail.com
PHONE: +91-8072781252
LOCATION: Tamil Nadu, India
GITHUB: https://github.com/Dhamotharan281
LINKEDIN: https://www.linkedin.com/in/dhamotharan-muthaiyan-3ba50b216/

PROFESSIONAL SUMMARY:
Full Stack Developer specializing in the MERN stack and AI-powered web applications, with expertise in building
scalable, real-time SaaS platforms and modern web solutions. Skilled in developing responsive user interfaces with
React.js and Next.js, and designing high-performance backend services with Node.js, Express.js, MongoDB, Redis, and
event-driven architectures. Experienced in integrating Generative AI, LLMs, and Retrieval-Augmented Generation
(RAG) into production applications. Strong foundation in data structures, system design, API development, database
optimization, and cloud deployment, with a focus on performance, scalability, and user experience.

STATISTICS:
- 9+ months of professional experience
- 10+ projects built
- 30+ technologies mastered
- 8.4/10 CGPA (MCA)

TECHNICAL SKILLS:
Languages: JavaScript (ES6+), TypeScript, Python, SQL
Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3, Responsive & Accessible UI Design
Backend: Node.js, Express.js, REST APIs, GraphQL, Socket.IO, JWT Authentication, Microservices
Databases & Cache: MongoDB, MySQL, Redis (Caching & Pub/Sub)
Cloud & DevOps: Docker, AWS, Apache Kafka, Git/GitHub, CI/CD fundamentals
AI & Data: Gemini AI, RAG (LangChain), Pandas, NumPy, Scikit-Learn

PROJECTS:

1. AI Incident Management Platform — Intelligent DevOps Monitoring & Resolution System (AI)
   AI-powered incident management platform that analyzes production failures, application logs, and system
   alerts to identify root causes and recommend remediation actions. Intelligent triage workflows using
   LLMs and RAG enable DevOps teams to quickly diagnose outages and generate actionable resolution suggestions.
   Real-time event ingestion pipelines built with Kafka and Redis.
   Tech: Next.js, Node.js, MongoDB, Redis, Kafka, Python, Gemini AI, RAG
   GitHub: https://github.com/Dhamotharan281

2. PawSign — AI-Powered Accessibility & Healthcare Booking Platform (AI)
   Inclusive healthcare booking platform enabling speech-impaired users to schedule appointments through
   real-time hand-gesture recognition. Integrated MediaPipe computer vision models to translate gestures
   into structured application commands. Secure authentication, appointment scheduling, RBAC.
   Tech: MERN Stack, Python, MediaPipe, Computer Vision, JWT, MongoDB
   GitHub: https://github.com/Dhamotharan281/Action-Based-Pet-Service-Booking-System-MERN-Stack-AI-

3. Enterprise Multi-Tenant Collaboration SaaS — No-Code Workspace Platform (Web)
   Multi-tenant no-code SaaS platform with secure tenant isolation, real-time chat, group messaging,
   broadcasts, screen sharing, multilingual translation, Wiki docs, file sharing, shared notes,
   bookmarks, to-do lists, planners, polls, and approval workflows.
   Tech: Next.js, Node.js, MongoDB, Redis, Kafka, Socket.IO, React Native, RAG

4. DataForge — AI-Powered Data Analytics Platform (AI)
   Analytics platform enabling natural language interaction with structured datasets using Gemini AI and RAG.
   Tech: React.js, Python, Flask, Gemini AI, RAG, LangChain, Pandas, MongoDB
   GitHub: https://github.com/Dhamotharan281/AI-Powered-Data-Analytics-Dashboard-MERN-Stack-

5. Real-Time Chat Platform (Web)
   Real-time communication platform with WebRTC audio/video calling, Redis presence tracking, JWT/RBAC,
   and React Native mobile app.
   Tech: React.js, Node.js, Socket.IO, WebRTC, Redis, React Native, JWT, MongoDB

6. MediCare AI — Hospital Management (Web)
   Hospital management with Gemini AI appointment booking (voice + text), WebRTC doctor-patient video calls,
   and role-based admin dashboard.
   Tech: React.js, Node.js, MongoDB, Gemini AI, WebRTC, Socket.IO, Express.js

7. Spotify Clone (Web)
   Responsive music streaming app with playlist management and playback controls.
   Tech: React.js, Node.js, MongoDB, Tailwind CSS, Express.js

PROFESSIONAL EXPERIENCE:

1. Software Developer at HEPL, Tamil Nadu (Apr 2025 – Present | Full-time)
   Project: Enterprise Multi-Tenant Collaboration & No-Code SaaS Platform
   - Contributed to a multi-tenant SaaS platform enabling secure tenant isolation, workflow automation,
     and real-time collaboration across enterprise organizations.
   - Built real-time chat, group messaging, broadcasts, screen sharing, and multilingual translation
     features using Socket.IO and Kafka.
   - Developed collaboration modules including Wiki documentation, file sharing, shared notes, bookmarks,
     to-do lists, planners, polls, and approval workflows.
   - Implemented event-driven backend services with Redis and Kafka for scalable, low-latency communication.
   - Contributed to React Native app: chat, notifications, location sharing, and product-view features.
   - Integrated a RAG-based AI assistant for contextual answers about platform features and workflows.

2. MERN Stack Developer Intern at HEPL, Tamil Nadu (Dec 2024 – Mar 2025 | Internship)
   - Built full-stack web applications end-to-end using React.js, Node.js, Express.js, and MongoDB.
   - Implemented secure authentication with JWT, refresh tokens, and Role-Based Access Control (RBAC).
   - Optimized backend APIs and MongoDB queries, improving average response times for key endpoints.

3. Python Full Stack Developer Intern at Inmakes Info Tech, Tamil Nadu (Sep 2024 – Nov 2024 | Internship)
   - Developed full-stack web application features using Django, React.js, HTML, CSS, and JavaScript.
   - Contributed to e-commerce platform development including product management and order processing.
   - Designed and integrated RESTful APIs for frontend-backend communication.
   - Worked with relational databases for data modeling, CRUD operations, and query optimization.

EDUCATION:
1. MCA – Rajiv Gandhi College of Engineering & Technology, Puducherry (2022–2024) | CGPA: 8.4/10
2. BCA – Achariya Arts & Science College, Puducherry (2019–2022) | CGPA: 7.5/10

CERTIFICATIONS:
- AWS Solutions Architecture Virtual Experience (Forage)
- Deloitte Cyber Security Virtual Experience (Forage)
- Google Cloud Platform – Website Deployment (Google)
- Python Data Science Program (360DigiTMG)
- Java Full Stack Development (Greens Technology)
`.trim()

export const SYSTEM_PROMPT = `You are an AI assistant embedded in M. Dhamotharan's portfolio website.
Answer ONLY about Dhamotharan using the portfolio data below. Be friendly, concise, and professional.
Refer to him in third person ("Dhamotharan has..." / "He worked on...").
If the question is unrelated to his portfolio, say: "I can only answer questions about Dhamotharan's portfolio. Ask about his skills, projects, or experience!"
Keep answers under 150 words unless the user asks for more detail.

PORTFOLIO DATA:
${PORTFOLIO_CONTEXT}`

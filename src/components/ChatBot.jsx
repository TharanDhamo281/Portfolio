import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const SUGGESTED = [
  'What are your top skills?',
  'Tell me about your projects',
  'What is your work experience?',
  'How can I contact you?',
]

// ─── Smart local fallback (answers from resume data when Gemini quota is hit) ─
function localAnswer(q) {
  const t = q.toLowerCase()

  if (/contact|email|phone|reach|hire|mail/.test(t))
    return `You can reach Dhamotharan at:\n📧 mddhamotharan281@gmail.com\n📞 +91-8072781252\n🐙 github.com/Dhamotharan281\n💼 linkedin.com/in/dhamotharan-muthaiyan-3ba50b216`

  if (/skill|tech|stack|language|framework|tool/.test(t))
    return `Dhamotharan's core stack:\n\n🔹 Frontend: React.js , Next.js, TypeScript, Tailwind CSS\n🔹 Backend: Node.js, Express.js, REST APIs, Socket.IO, Microservices\n🔹 Databases: MongoDB, MySQL, Redis (Caching & Pub/Sub)\n🔹 Cloud/DevOps: Docker,Apache Kafka, GitHub CI/CD\n🔹 AI/ML: Gemini AI, RAG/LangChain, Pandas, Scikit-Learn,Numpy,`

  if (/project|built|made|portfolio/.test(t))
    return `Notable projects:\n\n1️⃣ AI Incident Management Platform — DevOps monitoring with LLMs, RAG, Kafka (NEW)\n2️⃣ PawSign — AI sign-language healthcare booking (MediaPipe + MERN)\n3️⃣ Enterprise Multi-Tenant SaaS — No-code platform with Kafka, Redis, React Native\n4️⃣ DataForge — AI analytics with Gemini AI + RAG\n5️⃣ Real-Time Chat — WebRTC video/audio + Socket.IO\n6️⃣ MediCare AI — Hospital management with AI booking`

  if (/experience|job|career|company|hepl/.test(t))
    return `Experience:\n\n💼 Software Developer @ HEPL (Apr 2025 – Present)\n   Enterprise multi-tenant SaaS: real-time chat, Kafka, Redis, React Native, RAG AI assistant\n\n💼 MERN Stack Intern @ HEPL (Dec 2024 – Mar 2025)\n   Full-stack apps, JWT/RBAC auth, MongoDB optimisation\n\n💼 Python Full Stack Intern @ Inmakes Info Tech (Sep–Nov 2024)\n   Django, React.js, e-commerce platform, RESTful APIs`

  if (/education|degree|college|university|study|cgpa|mca|bca/.test(t))
    return `Education:\n\n🎓 MCA – Rajiv Gandhi College of Engineering & Technology, Puducherry (2022–2024) | CGPA: 8.4/10\n\n🎓 BCA – Achariya Arts & Science College, Puducherry (2019–2022) | CGPA: 7.5/10`

  if (/certif|aws|google|deloitte/.test(t))
    return `Certifications:\n\n✅ AWS Solutions Architecture Virtual Experience (Forage)\n✅ Deloitte Cyber Security Virtual Experience (Forage)\n✅ Google Cloud Platform – Website Deployment (Google)\n✅ Python Data Science Program (360DigiTMG)\n✅ Java Full Stack Development (Greens Technology)`

  if (/location|where|city|tamil|india/.test(t))
    return `Dhamotharan is based in Tamil Nadu, India, and is open to remote opportunities worldwide.`

  if (/hello|hi|hey|who|about/.test(t))
    return `Hi! I'm Dhamotharan's portfolio assistant.\n\nDhamotharan is a Full Stack Web Developer & MERN Stack specialist with 9+ months of professional experience building enterprise SaaS platforms, real-time systems, and AI-integrated products at HEPL.\n\nAsk me about his skills, projects, or experience!`

  if (/resume|cv|download/.test(t))
    return `You can download Dhamotharan's resume directly from the portfolio — click the "Download Resume" button in the hero section at the top of the page.`

  return `I can answer questions about Dhamotharan's skills, projects, work experience, education, or contact info. Try asking:\n• "What are your top skills?"\n• "Tell me about your projects"\n• "What is your work experience?"`
}

const WELCOME = "Hi! I'm Dhamotharan's AI assistant . Ask me about his skills, projects, experience, or anything on this portfolio!"

// Colour tokens — cyan/purple palette
const C = {
  border: 'rgba(0,229,255,0.22)',
  bg: 'rgba(6,2,26,0.97)',
  headerBg: 'rgba(0,229,255,0.05)',
  headerBdr: 'rgba(0,229,255,0.14)',
  aiBubble: 'rgba(0,229,255,0.06)',
  aiBdr: 'rgba(0,229,255,0.1)',
  userBubble: 'linear-gradient(135deg, rgba(170,68,255,0.3), rgba(0,229,255,0.18))',
  userBdr: 'rgba(0,229,255,0.35)',
  inputBg: 'rgba(0,229,255,0.04)',
  inputBdr: 'rgba(0,229,255,0.16)',
  cyan: '#00e5ff',
  purple: '#aa44ff',
  dimCyan: 'rgba(0,229,255,0.6)',
  shadow: '0 24px 60px rgba(0,229,255,0.1), 0 0 0 1px rgba(0,229,255,0.08)',
  btnShadow: '0 8px 32px rgba(0,229,255,0.18)',
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'ai', text: WELCOME }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const send = async (text = input) => {
    const q = (text || '').trim()
    if (!q || isLoading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()

      // If Gemini quota / rate-limit hit, use smart local fallback silently
      const isQuota = data.error && (
        data.error.includes('429') ||
        data.error.includes('quota') ||
        data.error.includes('Too Many') ||
        data.error.includes('rate')
      )

      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.answer || (isQuota ? localAnswer(q) : (data.error || 'Something went wrong. Please try again.')),
      }])
    } catch {
      // Network error — still answer from local data
      setMessages(prev => [...prev, {
        role: 'ai',
        text: localAnswer(q),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const showSuggestions = messages.length === 1 && !isLoading

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)] sm:max-w-none">

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="w-[calc(100vw-2rem)] sm:w-96 flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: C.bg,
              backdropFilter: 'blur(24px)',
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
              maxHeight: 'min(520px, calc(100vh - 120px))',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: `1px solid ${C.headerBdr}`, background: C.headerBg }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.4)' }}
                  >
                    <Bot size={17} color={C.cyan} />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: '#22c55e', border: '2px solid #06021a' }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wider text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    AI ASSISTANT
                  </p>
                  <p className="text-xs" style={{ color: C.dimCyan, fontFamily: 'Share Tech Mono, monospace' }}>
                    Dhamotharan · Portfolio Bot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: C.dimCyan }}
                onMouseEnter={e => e.currentTarget.style.color = C.cyan}
                onMouseLeave={e => e.currentTarget.style.color = C.dimCyan}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      background: msg.role === 'ai' ? C.aiBubble : 'rgba(170,68,255,0.18)',
                      border: `1px solid ${msg.role === 'ai' ? C.aiBdr : 'rgba(170,68,255,0.4)'}`,
                    }}
                  >
                    {msg.role === 'ai'
                      ? <Bot size={12} color={C.cyan} />
                      : <User size={12} color={C.purple} />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${msg.role === 'ai' ? 'rounded-tl-none' : 'rounded-tr-none'
                      }`}
                    style={{
                      background: msg.role === 'ai' ? C.aiBubble : C.userBubble,
                      border: `1px solid ${msg.role === 'ai' ? C.aiBdr : C.userBdr}`,
                      color: msg.role === 'ai' ? 'rgba(220,220,220,0.95)' : 'rgba(255,255,255,0.95)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 flex-row"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: C.aiBubble, border: `1px solid ${C.aiBdr}` }}
                  >
                    <Bot size={12} color={C.cyan} />
                  </div>
                  <div
                    className="rounded-xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center"
                    style={{ background: C.aiBubble, border: `1px solid ${C.aiBdr}` }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: C.cyan }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggested questions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0 overflow-hidden"
                >
                  {SUGGESTED.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => send(q)}
                      className="text-xs px-2.5 py-1 rounded-full transition-all"
                      style={{
                        background: C.aiBubble,
                        border: `1px solid ${C.border}`,
                        color: C.dimCyan,
                        fontFamily: 'Share Tech Mono, monospace',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(0,229,255,0.12)'
                        e.currentTarget.style.color = C.cyan
                        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.45)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = C.aiBubble
                        e.currentTarget.style.color = C.dimCyan
                        e.currentTarget.style.borderColor = C.border
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div
              className="p-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${C.headerBdr}` }}
            >
              <div
                className="flex gap-2 items-center rounded-xl px-3 py-2"
                style={{ background: C.inputBg, border: `1px solid ${C.inputBdr}` }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Ask about Dhamotharan..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{
                    color: 'rgba(230,230,230,0.95)',
                    fontFamily: 'Share Tech Mono, monospace',
                    caretColor: C.cyan,
                  }}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 rounded-lg transition-all flex-shrink-0"
                  style={{
                    background: input.trim() && !isLoading ? 'rgba(0,229,255,0.22)' : 'transparent',
                    border: `1px solid ${C.border}`,
                    opacity: !input.trim() || isLoading ? 0.35 : 1,
                    cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Send message"
                >
                  <Send size={13} color={C.cyan} />
                </button>
              </div>
              <p
                className="text-center text-xs mt-2"
                style={{ color: 'rgba(0,229,255,0.28)', fontFamily: 'Share Tech Mono, monospace' }}
              >
                · portfolio data only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
        style={{
          background: isOpen
            ? 'rgba(0,229,255,0.15)'
            : 'linear-gradient(135deg, rgba(0,229,255,0.4), rgba(170,68,255,0.35))',
          border: '1px solid rgba(0,229,255,0.4)',
          backdropFilter: 'blur(12px)',
          boxShadow: C.btnShadow,
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} color="rgba(0,229,255,0.85)" />
            </motion.span>
          ) : (
            <motion.span key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={22} color="#ffffff" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse dot */}
        {!isOpen && (
          <motion.span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full"
            style={{ background: '#00e5ff', border: '2px solid #06021a' }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const SUGGESTED = [
  'What are your top skills?',
  'Tell me about your projects',
  'What is your work experience?',
  'How can I contact you?',
]

const WELCOME = "Hi! I'm Dhamotharan's AI assistant. Ask me about his skills, projects, experience, or anything on this portfolio!"

export default function ChatBot() {
  const [isOpen, setIsOpen]       = useState(false)
  const [messages, setMessages]   = useState([{ role: 'ai', text: WELCOME }])
  const [input, setInput]         = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const endRef    = useRef(null)
  const inputRef  = useRef(null)

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
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question: q }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.answer || data.error || 'Something went wrong. Please try again.',
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Connection error. Make sure the API is running.',
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85, y: 16  }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="w-[22rem] sm:w-96 flex flex-col rounded-2xl overflow-hidden"
            style={{
              background:    'rgba(4, 0, 0, 0.97)',
              backdropFilter: 'blur(24px)',
              border:         '1px solid rgba(255, 26, 26, 0.25)',
              boxShadow:      '0 24px 60px rgba(255,26,26,0.12), 0 0 0 1px rgba(255,26,26,0.08)',
              maxHeight:      '520px',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,26,26,0.15)', background: 'rgba(255,26,26,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,26,26,0.15)', border: '1px solid rgba(255,26,26,0.4)' }}
                  >
                    <Bot size={17} color="#ff6666" />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: '#22c55e', border: '2px solid #040000' }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wider text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    AI ASSISTANT
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,102,102,0.7)', fontFamily: 'Share Tech Mono, monospace' }}>
                    Dhamotharan · Portfolio Bot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'rgba(255,102,102,0.5)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff6666'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,102,102,0.5)'}
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
                      background: msg.role === 'ai' ? 'rgba(255,26,26,0.12)' : 'rgba(255,68,0,0.2)',
                      border: `1px solid ${msg.role === 'ai' ? 'rgba(255,26,26,0.25)' : 'rgba(255,68,0,0.4)'}`,
                    }}
                  >
                    {msg.role === 'ai'
                      ? <Bot  size={12} color="#ff6666" />
                      : <User size={12} color="#ff9966" />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'ai' ? 'rounded-tl-none' : 'rounded-tr-none'
                    }`}
                    style={{
                      background: msg.role === 'ai'
                        ? 'rgba(255,26,26,0.06)'
                        : 'linear-gradient(135deg, rgba(255,26,26,0.25), rgba(204,34,0,0.18))',
                      border: `1px solid ${msg.role === 'ai' ? 'rgba(255,26,26,0.1)' : 'rgba(255,26,26,0.35)'}`,
                      color:  msg.role === 'ai' ? 'rgba(220,220,220,0.95)' : 'rgba(255,255,255,0.95)',
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
                    style={{ background: 'rgba(255,26,26,0.12)', border: '1px solid rgba(255,26,26,0.25)' }}
                  >
                    <Bot size={12} color="#ff6666" />
                  </div>
                  <div
                    className="rounded-xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center"
                    style={{ background: 'rgba(255,26,26,0.06)', border: '1px solid rgba(255,26,26,0.1)' }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#ff4444' }}
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
                  exit={{   opacity: 0, height: 0 }}
                  className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0 overflow-hidden"
                >
                  {SUGGESTED.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => send(q)}
                      className="text-xs px-2.5 py-1 rounded-full transition-all"
                      style={{
                        background:  'rgba(255,26,26,0.06)',
                        border:      '1px solid rgba(255,26,26,0.25)',
                        color:       'rgba(255,102,102,0.8)',
                        fontFamily:  'Share Tech Mono, monospace',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,26,26,0.15)'
                        e.currentTarget.style.color      = '#ff6666'
                        e.currentTarget.style.borderColor = 'rgba(255,26,26,0.5)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background  = 'rgba(255,26,26,0.06)'
                        e.currentTarget.style.color       = 'rgba(255,102,102,0.8)'
                        e.currentTarget.style.borderColor = 'rgba(255,26,26,0.25)'
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
              style={{ borderTop: '1px solid rgba(255,26,26,0.12)' }}
            >
              <div
                className="flex gap-2 items-center rounded-xl px-3 py-2"
                style={{ background: 'rgba(255,26,26,0.05)', border: '1px solid rgba(255,26,26,0.18)' }}
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
                    color:       'rgba(230,230,230,0.95)',
                    fontFamily:  'Share Tech Mono, monospace',
                    caretColor:  '#ff4444',
                  }}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 rounded-lg transition-all flex-shrink-0"
                  style={{
                    background:   input.trim() && !isLoading ? 'rgba(255,26,26,0.3)' : 'transparent',
                    border:       '1px solid rgba(255,26,26,0.3)',
                    opacity:      !input.trim() || isLoading ? 0.35 : 1,
                    cursor:       !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  }}
                  aria-label="Send message"
                >
                  <Send size={13} color="#ff6666" />
                </button>
              </div>
              <p
                className="text-center text-xs mt-2"
                style={{ color: 'rgba(255,26,26,0.3)', fontFamily: 'Share Tech Mono, monospace' }}
              >
                Powered by Gemini AI · answers from portfolio data only
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
          background:    isOpen
            ? 'rgba(255,26,26,0.25)'
            : 'linear-gradient(135deg, rgba(255,26,26,0.55), rgba(180,20,0,0.45))',
          border:         '1px solid rgba(255,26,26,0.5)',
          backdropFilter: 'blur(12px)',
          boxShadow:      '0 8px 32px rgba(255,26,26,0.2)',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{   scale: 0.94 }}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate:   0, opacity: 1 }}
              exit={{   rotate:  90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} color="rgba(255,180,180,0.9)" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate:  90, opacity: 0 }}
              animate={{ rotate:   0, opacity: 1 }}
              exit={{   rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={22} color="#ffffff" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse dot — only when closed */}
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

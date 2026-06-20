import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { personalInfo } from '../data/resume'

const INPUT_CLASS =
  'w-full bg-dark-card border border-dark-border text-slate-200 font-mono text-sm px-4 py-3 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_8px_#ff1a1a44] transition-all duration-200 placeholder-slate-600 resize-none'

export default function Contact() {
  const formRef = useRef()
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      )
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-neon-cyan text-sm tracking-widest uppercase">// get_in_touch</span>
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mt-2">CONTACT</h2>
          <div className="section-header-line w-32 mx-auto mt-4" />
          <p className="text-slate-400 mt-6 font-body max-w-xl mx-auto">
            Have a project in mind or want to collaborate? Drop a message — I respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="glass border border-neon-cyan/10 p-6">
              <h3 className="font-orbitron font-bold text-neon-cyan mb-6 tracking-widest text-sm uppercase">
                Transmission Info
              </h3>

              {[
                { icon: Mail,    label: 'Email',    value: personalInfo.email,    href: `mailto:${personalInfo.email}` },
                { icon: Phone,   label: 'Phone',    value: personalInfo.phone,    href: `tel:${personalInfo.phone}` },
                { icon: MapPin,  label: 'Location', value: personalInfo.location, href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-slate-500 uppercase">{label}</div>
                    {href
                      ? <a href={href} className="font-mono text-sm text-slate-300 hover:text-neon-cyan transition-colors">{value}</a>
                      : <span className="font-mono text-sm text-slate-300">{value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-4">
              {[
                { icon: Github,   href: personalInfo.github,   label: 'GitHub' },
                { icon: Linkedin, href: personalInfo.linkedin,  label: 'LinkedIn' },
                { icon: Mail,     href: `mailto:${personalInfo.email}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-12 h-12 border border-neon-cyan/30 flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_12px_#ff1a1a44] transition-all duration-200"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-neon-cyan uppercase tracking-widest block mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your callsign"
                  required
                  className={INPUT_CLASS}
                  aria-label="Name"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-neon-cyan uppercase tracking-widest block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className={INPUT_CLASS}
                  aria-label="Email"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-neon-cyan uppercase tracking-widest block mb-1">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Transmit your message..."
                  required
                  className={INPUT_CLASS}
                  aria-label="Message"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full relative py-3 font-orbitron font-bold text-sm tracking-widest uppercase border border-neon-cyan text-neon-cyan overflow-hidden transition-all duration-300 hover:text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 bg-neon-cyan translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
                <Send size={14} className="relative" />
                <span className="relative">
                  {status === 'sending' ? 'Transmitting...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Failed — Retry' : 'Send Message'}
                </span>
              </motion.button>

              {status === 'success' && (
                <p className="font-mono text-xs text-neon-green text-center">
                  ✓ Transmission received. I&apos;ll respond soon!
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

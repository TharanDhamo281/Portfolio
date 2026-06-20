import { motion } from 'framer-motion'
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation'
import { personalInfo } from '../data/resume'

function StatCard({ label, value, suffix, isActive }) {
  const count = useCountUp(value, 2000, isActive)
  return (
    <div className="glass border border-neon-cyan/20 p-2 sm:p-4 text-center">
      <div className="font-orbitron font-bold text-2xl sm:text-3xl neon-text-cyan">
        {count}{suffix}
      </div>
      <div className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  )
}

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function About() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-neon-cyan text-sm tracking-widest uppercase">// about_me</span>
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mt-2">
            WHO AM I?
          </h2>
          <div className="section-header-line w-32 mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Avatar / photo frame */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Animated neon border */}
              <div className="absolute inset-0 border-2 border-neon-cyan animate-pulse-neon rounded-sm" />
              <div className="absolute inset-2 border border-neon-purple/50 rounded-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 rounded-sm flex items-center justify-center">
                {/* Initials avatar */}
                <div className="text-center">
                  <div className="font-orbitron font-black text-7xl neon-text-cyan leading-none">DH</div>
                  <div className="font-mono text-xs text-slate-400 tracking-[0.4em] mt-2">DEVELOPER</div>
                </div>
              </div>
              {/* Corner accents */}
              {['-top-1 -left-1','–top-1 -right-1','-bottom-1 -left-1','-bottom-1 -right-1'].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute w-4 h-4 border-2 border-neon-green ${['top-0 left-0 border-r-0 border-b-0','top-0 right-0 border-l-0 border-b-0','bottom-0 left-0 border-r-0 border-t-0','bottom-0 right-0 border-l-0 border-t-0'][i]}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="glass border border-neon-cyan/10 p-4 sm:p-6 mb-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
              <div className="text-neon-purple mb-2">// profile.txt</div>
              <p className="text-slate-300">
                <span className="text-neon-green">const</span>{' '}
                <span className="text-neon-cyan">developer</span> = {'{'}<br />
                <span className="ml-4 text-slate-400">name: </span>
                <span className="text-yellow-300">"M. Dhamotharan"</span>,<br />
                <span className="ml-4 text-slate-400">role: </span>
                <span className="text-yellow-300">"MERN Stack Developer"</span>,<br />
                <span className="ml-4 text-slate-400">location: </span>
                <span className="text-yellow-300">"Cuddalore, Tamil Nadu"</span>,<br />
                <span className="ml-4 text-slate-400">passion: </span>
                <span className="text-yellow-300">"Scalable architecture &amp; AI"</span>,<br />
                {'}'};
              </p>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6 font-body">
              {personalInfo.summary}
            </p>

            <p className="text-slate-400 leading-relaxed font-body text-sm">
              Currently at <span className="text-neon-cyan">HEPL Company</span> architecting a multi-tenant
              no-code SaaS platform. I thrive at the intersection of scalable backend systems,
              real-time features, and delightful UX — always shipping production-ready code.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {personalInfo.stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...s} isActive={isVisible} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

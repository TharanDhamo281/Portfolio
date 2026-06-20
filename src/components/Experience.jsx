import { motion } from 'framer-motion'
import { experience, education, certifications } from '../data/resume'
import { Briefcase, GraduationCap, Award } from 'lucide-react'

function TimelineCard({ item, index }) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
      className={`relative flex ${isLeft ? 'lg:justify-end' : 'lg:justify-start'} mb-12`}
    >
      {/* Mobile: full-width; Desktop: half-width with alternating sides */}
      <div className={`w-full lg:w-[46%] ${isLeft ? 'lg:mr-[4%]' : 'lg:ml-[50%]'}`}>
        <div
          className="glass border p-6 hover:scale-[1.01] transition-transform duration-300 relative"
          style={{ borderColor: `${item.color}33` }}
        >
          {/* Connector dot (desktop) */}
          <div
            className="hidden lg:block absolute top-8 w-4 h-4 rounded-full border-2 z-10"
            style={{
              [isLeft ? 'right' : 'left']: '-8%',
              backgroundColor: item.color,
              borderColor: item.color,
              boxShadow: `0 0 12px ${item.color}`,
            }}
          />

          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-orbitron font-bold text-base" style={{ color: item.color }}>
              {item.role}
            </h3>
            <span
              className="font-mono text-xs px-2 py-0.5 border ml-2 shrink-0"
              style={{ color: item.color, borderColor: `${item.color}44` }}
            >
              {item.type}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={12} className="text-slate-500" />
            <span className="font-mono text-xs text-slate-400">{item.company}</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-xs text-slate-500">{item.location}</span>
          </div>

          <div className="font-mono text-xs text-neon-green mb-4">{item.period}</div>

          <ul className="space-y-2">
            {item.points.map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span style={{ color: item.color }} className="shrink-0 mt-0.5">▶</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-neon-cyan text-sm tracking-widest uppercase">// career_log</span>
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mt-2">EXPERIENCE</h2>
          <div className="section-header-line w-32 mx-auto mt-4" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px timeline-line" />

          {experience.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={24} className="text-neon-cyan" />
            <h3 className="font-orbitron font-bold text-2xl text-white">Education</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass border p-6"
                style={{ borderColor: `${edu.color}33` }}
              >
                <h4 className="font-orbitron font-bold text-sm mb-1" style={{ color: edu.color }}>
                  {edu.degree}
                </h4>
                <p className="font-mono text-xs text-slate-400 mb-1">{edu.institution}</p>
                <p className="font-mono text-xs text-slate-500 mb-3">{edu.location} · {edu.period}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">CGPA:</span>
                  <span className="font-orbitron font-bold text-sm neon-text-cyan">{edu.cgpa}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Award size={24} className="text-neon-purple" />
            <h3 className="font-orbitron font-bold text-2xl text-white">Certifications</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass border p-4 hover:scale-105 transition-transform duration-200"
                style={{ borderColor: `${cert.color}33` }}
              >
                <div className="font-mono text-xs mb-1" style={{ color: cert.color }}>▶ {cert.name}</div>
                <div className="font-mono text-xs text-slate-500">{cert.issuer}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

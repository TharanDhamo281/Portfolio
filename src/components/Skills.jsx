import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data/resume'

const SkillSphere = lazy(() => import('./three/SkillSphere'))

const CATEGORY_COLORS = {
  Languages:          '#00e5ff',
  Frontend:           '#aa44ff',
  Backend:            '#00ff88',
  'Databases & Cache':'#00e5ff',
  'Cloud & DevOps':   '#aa44ff',
  'AI & Data':        '#00ff88',
}

function SkillBar({ name, level, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="mb-3"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-xs text-slate-300">{name}</span>
        <span className="font-mono text-xs" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}66` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-neon-cyan text-sm tracking-widest uppercase">// tech_stack</span>
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mt-2">SKILLS</h2>
          <div className="section-header-line w-32 mx-auto mt-4" />
        </motion.div>

        {/* 3D sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-[420px] mb-16 mx-auto max-w-2xl"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="font-mono text-neon-cyan animate-pulse">Loading 3D Skill Sphere...</div>
              </div>
            }
          >
            <SkillSphere />
          </Suspense>
        </motion.div>

        {/* Skill grids */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skills).map(([category, items], ci) => {
            const color = CATEGORY_COLORS[category] || '#00e5ff'
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.08, duration: 0.6 }}
                className="glass border p-5 hover:scale-[1.02] transition-transform duration-300"
                style={{ borderColor: `${color}33` }}
              >
                <h3
                  className="font-orbitron font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b"
                  style={{ color, borderColor: `${color}44` }}
                >
                  {category}
                </h3>
                {items.map((s) => (
                  <SkillBar key={s.name} {...s} color={color} />
                ))}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

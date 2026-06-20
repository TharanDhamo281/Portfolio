import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { projects } from '../data/resume'

const FILTERS = ['All', 'Web', 'AI']

function ProjectCard({ project }) {
  const { title, description, tech, github, live, color, category } = project

  return (
    <div className="flip-card h-72 group" aria-label={`Project: ${title}`}>
      <div className="flip-card-inner">
        {/* Front */}
        <div
          className="flip-card-front glass border p-6 flex flex-col justify-between"
          style={{ borderColor: `${color}44` }}
        >
          <div>
            <div className="flex items-start justify-between mb-3">
              <span
                className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 border"
                style={{ color, borderColor: `${color}66` }}
              >
                {category}
              </span>
              <div className="w-8 h-8 border flex items-center justify-center"
                style={{ borderColor: `${color}44`, color }}>
                &lt;/&gt;
              </div>
            </div>
            <h3
              className="font-orbitron font-bold text-lg leading-tight mb-3"
              style={{ color }}
            >
              {title}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2 py-0.5 bg-dark-border text-slate-400"
              >
                {t}
              </span>
            ))}
            {tech.length > 4 && (
              <span className="font-mono text-xs px-2 py-0.5 bg-dark-border text-slate-500">
                +{tech.length - 4}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-neon-cyan mt-3 opacity-60">// hover to flip</p>
        </div>

        {/* Back */}
        <div
          className="flip-card-back glass border p-6 flex flex-col justify-between"
          style={{ borderColor: `${color}66`, background: `linear-gradient(135deg, ${color}08, #06021a)` }}
        >
          <div>
            <h3 className="font-orbitron font-bold text-sm mb-3" style={{ color }}>
              {title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
          </div>
          <div>
            <div className="flex flex-wrap gap-1 mb-4">
              {tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{ background: `${color}22`, color }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center gap-1.5 font-mono text-xs text-slate-300 hover:text-neon-cyan transition-colors"
              >
                <Github size={14} /> Code
              </a>
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live Demo"
                className="flex items-center gap-1.5 font-mono text-xs text-slate-300 hover:text-neon-green transition-colors"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-mono text-neon-cyan text-sm tracking-widest uppercase">// featured_work</span>
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mt-2">PROJECTS</h2>
          <div className="section-header-line w-32 mx-auto mt-4" />
        </motion.div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-orbitron text-xs uppercase tracking-widest px-5 py-2 border transition-all duration-200 ${
                filter === f
                  ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-[0_0_10px_#00e5ff44]'
                  : 'border-slate-600 text-slate-400 hover:border-neon-cyan/50 hover:text-neon-cyan/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

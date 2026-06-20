import { useState, useEffect, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ChevronDown } from 'lucide-react'
import { Link } from 'react-scroll'
import { personalInfo } from '../data/resume'
import { useMousePosition } from '../hooks/useMousePosition'

const ParticleField = lazy(() => import('./three/ParticleField'))

function Typewriter({ words }) {
  const [index, setIndex]   = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    let timeout

    if (!deleting && display === word) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && display === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      const speed = deleting ? 50 : 100
      timeout = setTimeout(() => {
        setDisplay((d) => deleting ? d.slice(0, -1) : word.slice(0, d.length + 1))
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [display, deleting, index, words])

  return (
    <span className="typewriter-cursor terminal-text text-xl md:text-2xl">
      {display}
    </span>
  )
}

const socials = [
  { icon: Github,   href: personalInfo.github,   label: 'GitHub' },
  { icon: Linkedin, href: personalInfo.linkedin,  label: 'LinkedIn' },
  { icon: Mail,     href: `mailto:${personalInfo.email}`, label: 'Email' },
]

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } },
  item: {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  },
}

export default function Hero() {
  const { normalized } = useMousePosition()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden scanlines"
    >
      {/* Three.js background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-dark-bg" />}>
          <ParticleField mouseNorm={normalized} />
        </Suspense>
      </div>

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-30 z-0" />

      {/* Radial fade at edges */}
      <div className="absolute inset-0 bg-radial-fade z-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #020000 100%)' }} />

      {/* Content */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Status badge */}
        <motion.div variants={stagger.item} className="inline-flex items-center gap-2 mb-4 sm:mb-6">
          <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="font-mono text-sm text-neon-green tracking-widest uppercase">
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={stagger.item}
          className="glitch font-orbitron font-black text-[2.6rem] xs:text-5xl sm:text-7xl md:text-8xl text-white mb-3 sm:mb-4 leading-none"
          data-text="DHAMOTHARAN"
        >
          DHAMOTHARAN
        </motion.h1>

        {/* Subtitle */}
        <motion.div variants={stagger.item} className="mb-4 sm:mb-8 h-10 flex items-center justify-center">
          <Typewriter words={personalInfo.jobTitles} />
        </motion.div>

        {/* Summary */}
        <motion.p
          variants={stagger.item}
          className="text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed font-body text-sm sm:text-base px-2"
        >
          Full Stack Developer crafting production-grade MERN, React Native &amp; cloud-native apps.
          Specialising in real-time systems, multi-tenant SaaS, and AI-integrated products.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={stagger.item} className="flex flex-wrap justify-center gap-4 mb-6 sm:mb-12">
          <Link to="projects" smooth duration={600}>
            <button className="group relative px-6 sm:px-8 py-2.5 sm:py-3 font-orbitron font-bold text-xs sm:text-sm tracking-widest uppercase border border-neon-cyan text-neon-cyan overflow-hidden transition-all duration-300 hover:text-dark-bg neon-border-cyan">
              <span className="absolute inset-0 bg-neon-cyan translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative">View My Work</span>
            </button>
          </Link>

          <a
            href={personalInfo.resumeUrl}
            download
            className="group relative px-6 sm:px-8 py-2.5 sm:py-3 font-orbitron font-bold text-xs sm:text-sm tracking-widest uppercase border border-neon-purple text-neon-purple overflow-hidden transition-all duration-300 hover:text-dark-bg neon-border-purple flex items-center gap-2"
          >
            <span className="absolute inset-0 bg-neon-purple translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
            <Download size={14} className="relative" />
            <span className="relative">Download Resume</span>
          </a>
        </motion.div>

        {/* Social icons */}
        <motion.div variants={stagger.item} className="flex justify-center gap-6">
          {socials.map(({ icon: Icon, href, label }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.2, y: -3 }}
              className="w-12 h-12 border border-neon-cyan/30 flex items-center justify-center text-slate-400 hover:text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_12px_#ff1a1a] transition-all duration-200"
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <Link to="about" smooth duration={600} className="cursor-pointer">
          <ChevronDown size={28} className="text-neon-cyan/60 hover:text-neon-cyan transition-colors" />
        </Link>
      </motion.div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Link } from 'react-scroll'
import { personalInfo } from '../data/resume'

const NAV_LINKS = ['hero','about','skills','projects','experience','contact']

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-neon-cyan/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <Link to="hero" smooth duration={600} className="cursor-pointer">
            <span className="font-orbitron font-black text-2xl neon-text-cyan tracking-widest">
              &lt;DH/&gt;
            </span>
          </Link>
        </motion.div>

        {/* Nav */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {NAV_LINKS.map((to) => (
            <Link
              key={to}
              to={to}
              smooth
              duration={600}
              className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-neon-cyan transition-colors cursor-pointer"
            >
              {to}
            </Link>
          ))}
        </div>

        {/* Credit */}
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-slate-500 mb-2">
          <span>Built with</span>
          <Heart size={12} className="text-neon-purple fill-neon-purple" />
          <span>using React + Three.js + Tailwind CSS</span>
        </div>

        <p className="font-mono text-xs text-slate-600">
          © {new Date().getFullYear()} {personalInfo.name} · All rights reserved
        </p>

        <div className="section-header-line w-48 mx-auto mt-6 opacity-30" />
      </div>
    </footer>
  )
}

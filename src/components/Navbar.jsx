import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-scroll'
import { playSynthSound } from './GamingHUD'

const NAV_LINKS = [
  { label: 'Home',       to: 'hero' },
  { label: 'About',      to: 'about' },
  { label: 'Skills',     to: 'skills' },
  { label: 'Projects',   to: 'projects' },
  { label: 'Experience', to: 'experience' },
  { label: 'Contact',    to: 'contact' },
]

export default function Navbar({ gamingMode, setGamingMode }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-neon-cyan/10 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="hero" smooth duration={600} className="cursor-pointer">
          <span className="font-orbitron font-bold text-xl neon-text-cyan tracking-widest">
            &lt;DH/&gt;
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                smooth
                duration={600}
                spy
                onSetActive={() => setActive(to)}
                className={`font-mono text-sm tracking-widest uppercase cursor-pointer transition-all duration-200 hover:text-neon-cyan ${
                  active === to ? 'text-neon-cyan' : 'text-slate-400'
                }`}
              >
                {active === to && <span className="text-neon-purple mr-1">▶</span>}
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                const nextVal = !gamingMode
                playSynthSound(nextVal ? 'toggleOn' : 'toggleOff', false)
                setGamingMode(nextVal)
              }}
              className={`font-orbitron text-xs tracking-widest uppercase border px-3 py-1.5 transition-all duration-200 select-none ${
                gamingMode 
                  ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-[0_0_10px_#00e5ff44]' 
                  : 'border-slate-700 text-slate-400 hover:border-neon-cyan hover:text-neon-cyan'
              }`}
            >
              🎮 {gamingMode ? 'HUD ON' : 'PLAY 3D HUD'}
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-neon-cyan"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-neon-cyan/10 overflow-hidden"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  smooth
                  duration={600}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 font-mono text-sm uppercase tracking-widest text-slate-300 hover:text-neon-cyan hover:bg-neon-cyan/5 transition-colors cursor-pointer"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="border-t border-neon-cyan/10 px-6 py-4 flex justify-between items-center bg-dark-bg/40">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">3D HUD Mode:</span>
              <button
                onClick={() => {
                  const nextVal = !gamingMode
                  playSynthSound(nextVal ? 'toggleOn' : 'toggleOff', false)
                  setGamingMode(nextVal)
                  setMenuOpen(false)
                }}
                className={`font-orbitron text-xs tracking-widest uppercase border px-4 py-2 transition-all ${
                  gamingMode 
                    ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10 shadow-[0_0_8px_#00e5ff44]' 
                    : 'border-slate-700 text-slate-400 hover:border-neon-cyan'
                }`}
              >
                🎮 {gamingMode ? 'HUD ON' : 'PLAY HUD'}
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

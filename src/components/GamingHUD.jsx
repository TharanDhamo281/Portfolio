import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Volume2, VolumeX, Cpu, Minimize2 } from 'lucide-react'

// Web Audio API Synthesizer Context
let audioCtx = null
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

// Background music scheduler states
let musicInterval = null
let musicNodes = []

export function startBackgroundMusic(isMuted) {
  if (isMuted) return
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    stopBackgroundMusic()

    let step = 0
    // Cyberpunk progression chords: Am -> F -> C -> G
    const chords = [
      [110, 220, 261.63], // Am
      [87.31, 174.61, 220], // F
      [130.81, 261.63, 329.63], // C
      [98.00, 196.00, 246.94] // G
    ]

    const playStep = () => {
      const chordIdx = Math.floor(step / 4) % chords.length
      const noteIdx = step % 3
      const freq = chords[chordIdx][noteIdx]

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      // Increased volume for better audibility
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8)

      osc.start()
      osc.stop(ctx.currentTime + 2.0)

      musicNodes.push(osc)
      
      // Keep nodes queue clean
      if (musicNodes.length > 15) {
        const old = musicNodes.shift()
        try { old.stop() } catch (e) {}
      }
      step++
    }

    playStep()
    musicInterval = setInterval(playStep, 650) // 100 bpm arpeggio
  } catch (e) {
    console.warn('Failed to start HUD background music:', e)
  }
}

export function stopBackgroundMusic() {
  if (musicInterval) {
    clearInterval(musicInterval)
    musicInterval = null
  }
  musicNodes.forEach(node => {
    try { node.stop() } catch (e) {}
  })
  musicNodes = []
}

export function playSynthSound(type, isMuted) {
  if (isMuted) return
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime

    if (type === 'hover') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, now)
      gain.gain.setValueAtTime(0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (type === 'click') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
      osc.start(now)
      osc.stop(now + 0.12)
    } else if (type === 'toggleOn') {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.45)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48)
      osc.start(now)
      osc.stop(now + 0.48)
    } else if (type === 'toggleOff') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
      osc.start(now)
      osc.stop(now + 0.42)
    }
  } catch (e) {
    // Ignore autoplay policy blocks
  }
}

const ZONES = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']

export default function GamingHUD({ isActive, onToggle }) {
  const [muted, setMuted] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [fps, setFps] = useState(60)
  const [scrollPct, setScrollPct] = useState(0)
  const [currentZone, setCurrentZone] = useState('HERO')
  
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  // Sound play wrappers
  const triggerSound = (type) => playSynthSound(type, muted)

  // Tracking FPS, Scroll Depth, and Active Zone
  useEffect(() => {
    let rafId
    
    const calculateStats = () => {
      // 1. Calculate FPS
      frameCount.current++
      const now = performance.now()
      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)))
        frameCount.current = 0
        lastTime.current = now
      }

      // 2. Calculate Scroll Percent
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setScrollPct(Math.min(Math.round((window.scrollY / scrollHeight) * 100), 100))
      }

      // 3. Detect Active Zone
      const middleY = window.innerHeight / 2
      const active = ZONES.find((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= middleY && rect.bottom >= middleY
      })
      if (active) {
        setCurrentZone(active.toUpperCase())
      }

      rafId = requestAnimationFrame(calculateStats)
    }

    rafId = requestAnimationFrame(calculateStats)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Music sequencer toggle effect
  useEffect(() => {
    if (isActive && !muted) {
      startBackgroundMusic(false)
    } else {
      stopBackgroundMusic()
    }
    return () => {
      stopBackgroundMusic()
    }
  }, [isActive, muted])

  const handleToggle = () => {
    try {
      const ctx = getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
    } catch (e) {}

    if (!isActive) {
      triggerSound('toggleOn')
      onToggle(true)
      setCollapsed(false)
    } else {
      triggerSound('toggleOff')
      onToggle(false)
    }
  }

  // Hover triggers for general portfolio elements in gaming mode
  useEffect(() => {
    if (!isActive) return

    const handleHover = (e) => {
      const target = e.target
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a')

      if (isInteractive) {
        triggerSound('hover')
      }
    }

    const handleClick = (e) => {
      const target = e.target
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a')

      if (isInteractive) {
        triggerSound('click')
      }
    }

    window.addEventListener('mouseover', handleHover, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })

    return () => {
      window.removeEventListener('mouseover', handleHover)
      window.removeEventListener('click', handleClick)
    }
  }, [isActive, muted])

  return (
    <>
      {/* ── Fixed Screen HUD Corner Brackets when active ── */}
      <AnimatePresence>
        {isActive && (
          <div className="pointer-events-none fixed inset-0 z-40 hidden md:block" aria-hidden="true">
            {/* Top Left */}
            <motion.div 
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20, y: -20 }}
              className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-neon-cyan/40"
            />
            {/* Top Right */}
            <motion.div 
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: -20 }}
              className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-neon-cyan/40"
            />
            {/* Bottom Left */}
            <motion.div 
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20, y: 20 }}
              className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-neon-cyan/40"
            />
            {/* Bottom Right */}
            <motion.div 
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: 20 }}
              className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-neon-cyan/40"
            />
            
            {/* Center Reticle Scanning Line (HUD visual element) */}
            <motion.div
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-px bg-neon-cyan/15 shadow-[0_0_8px_rgba(0,229,255,0.4)]"
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Floating Controls ── */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-3">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              className="glass border p-4 w-64 rounded-xl flex flex-col gap-3.5"
              style={{
                borderColor: isActive ? 'rgba(0,229,255,0.25)' : 'rgba(255,26,26,0.15)',
                background: 'rgba(6, 2, 20, 0.94)',
                boxShadow: isActive ? '0 16px 40px rgba(0,229,255,0.12)' : '0 16px 40px rgba(255,26,26,0.06)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-2" 
                style={{ borderColor: isActive ? 'rgba(0,229,255,0.15)' : 'rgba(255,26,26,0.1)' }}>
                <span className="font-orbitron font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Cpu size={12} className={isActive ? 'text-neon-cyan animate-pulse' : 'text-slate-400'} />
                  HUD Diagnostics
                </span>
                <button
                  onClick={() => { triggerSound('click'); setCollapsed(true) }}
                  className="text-slate-500 hover:text-white transition-colors"
                  aria-label="Collapse HUD"
                >
                  <Minimize2 size={12} />
                </button>
              </div>

              {/* Stats / Readings */}
              <div className="font-mono text-[11px] space-y-2 text-slate-300">
                {/* Active Zone */}
                <div className="flex justify-between">
                  <span className="text-slate-500">SYS_ZONE:</span>
                  <span className={isActive ? 'text-neon-cyan font-bold' : 'text-slate-300'}>{currentZone}</span>
                </div>
                {/* Simulated FPS */}
                <div className="flex justify-between">
                  <span className="text-slate-500">SYS_FPS:</span>
                  <span className={isActive ? 'text-neon-green' : 'text-slate-300'}>{fps} FPS</span>
                </div>
                {/* Scroll integrity */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">INTEGRITY:</span>
                    <span style={{ color: isActive ? '#00e5ff' : '#ff1a1a' }}>{scrollPct}%</span>
                  </div>
                  <div className="h-2 bg-dark-border border rounded-sm overflow-hidden" 
                    style={{ borderColor: isActive ? 'rgba(0,229,255,0.15)' : 'rgba(255,26,26,0.1)' }}>
                    <div 
                      className="h-full transition-all duration-150"
                      style={{ 
                        width: `${scrollPct}%`, 
                        background: isActive ? 'linear-gradient(90deg, #00e5ff, #aa44ff)' : 'linear-gradient(90deg, #ff1a1a, #cc2200)',
                        boxShadow: isActive ? '0 0 6px #00e5ff' : '0 0 6px #ff1a1a',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Utility switches */}
              <div className="flex items-center justify-between border-t pt-2.5 mt-1"
                style={{ borderColor: isActive ? 'rgba(0,229,255,0.15)' : 'rgba(255,26,26,0.1)' }}>
                {/* Mute button */}
                <button
                  onClick={() => {
                    try {
                      const ctx = getAudioContext()
                      if (ctx.state === 'suspended') {
                        ctx.resume()
                      }
                    } catch (e) {}
                    const nextMuted = !muted
                    setMuted(nextMuted)
                    playSynthSound('click', nextMuted)
                  }}
                  className={`p-1.5 border rounded-lg transition-all ${
                    muted 
                      ? 'border-slate-700 text-slate-500 bg-slate-900/50' 
                      : 'border-neon-cyan/25 text-neon-cyan bg-neon-cyan/5'
                  }`}
                  aria-label={muted ? 'Unmute HUD Audio' : 'Mute HUD Audio'}
                >
                  {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>

                {/* System status display */}
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                  ENG: <span className={isActive ? 'text-neon-green' : 'text-slate-500'}>{isActive ? 'ONLINE' : 'STANDBY'}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main toggle button or expand trigger ── */}
        <div className="flex items-center gap-2">
          {/* Game HUD Expand Button (if collapsed) */}
          {collapsed && (
            <motion.button
              onClick={() => { triggerSound('click'); setCollapsed(false) }}
              className="w-10 h-10 rounded-xl flex items-center justify-center border glass transition-all"
              style={{
                borderColor: isActive ? 'rgba(0,229,255,0.3)' : 'rgba(255,26,26,0.15)',
                boxShadow: isActive ? '0 4px 12px rgba(0,229,255,0.15)' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Expand HUD panel"
            >
              <Cpu size={16} className={isActive ? 'text-neon-cyan animate-pulse' : 'text-slate-400'} />
            </motion.button>
          )}

          {/* Master GAMING MODE switch */}
          <button
            onClick={handleToggle}
            className="h-10 px-4 font-orbitron font-bold text-xs uppercase tracking-widest border rounded-xl flex items-center gap-2 transition-all relative overflow-hidden group shadow-lg"
            style={{
              borderColor: isActive ? '#00e5ff' : 'rgba(255,26,26,0.4)',
              color: isActive ? '#00e5ff' : '#slate-400',
              background: isActive ? 'rgba(0,229,255,0.08)' : 'rgba(6,2,20,0.85)',
              boxShadow: isActive ? '0 0 15px rgba(0,229,255,0.25)' : 'none',
            }}
          >
            {/* Sliding grid fill background */}
            <span className="absolute inset-0 bg-neon-cyan/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            
            <Zap size={12} className={isActive ? 'text-neon-cyan fill-neon-cyan animate-bounce' : 'text-slate-500'} />
            <span>Gaming Mode: {isActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </>
  )
}

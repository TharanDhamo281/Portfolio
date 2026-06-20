import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone]         = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => { setDone(true); onComplete?.() }, 400)
          return 100
        }
        return p + Math.random() * 8 + 2
      })
    }, 60)
    return () => clearInterval(interval)
  }, [onComplete])

  const clamped = Math.min(progress, 100)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] bg-dark-bg flex flex-col items-center justify-center"
        >
          {/* Logo spin */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="font-orbitron font-black text-6xl neon-text-cyan mb-8 select-none"
          >
            &lt;DH/&gt;
          </motion.div>

          <div className="font-mono text-sm text-neon-cyan mb-4 tracking-widest">
            INITIALISING SYSTEMS...
          </div>

          {/* Bar */}
          <div className="w-64 h-2 bg-dark-border border border-neon-cyan/20 overflow-hidden">
            <div
              className="h-full loading-bar-fill transition-all duration-75"
              style={{ width: `${clamped}%` }}
            />
          </div>

          <div className="font-orbitron text-xs text-neon-cyan/60 mt-3">
            {Math.floor(clamped)}%
          </div>

          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

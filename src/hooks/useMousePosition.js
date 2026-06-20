import { useState, useEffect, useRef } from 'react'

export function useMousePosition() {
  const [normalized, setNormalized] = useState({ x: 0, y: 0 })
  const frameRef  = useRef(null)
  const pending   = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      pending.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(() => {
          setNormalized({ ...pending.current })
          frameRef.current = null
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return { position: { x: 0, y: 0 }, normalized }
}

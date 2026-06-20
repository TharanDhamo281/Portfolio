import { useEffect, useRef, useCallback } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })

  /* Red-to-orange fire hue: HSL 0–20 deg = red to orange-red */
  const addTrail = useCallback((x, y) => {
    const el = document.createElement('div')
    el.className = 'cursor-trail'
    el.style.cssText = `left:${x}px;top:${y}px;background:hsl(${Math.random() * 20},100%,55%);`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 500)
  }, [])

  useEffect(() => {
    let lastTrail = 0
    let rafId

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }
      const now = Date.now()
      if (now - lastTrail > 60) {   /* throttle: 60 ms (was 40 ms) */
        addTrail(e.clientX, e.clientY)
        lastTrail = now
      }
    }

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15
      ring.current.y += (pos.current.y - ring.current.y) * 0.15
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top  = `${ring.current.y}px`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [addTrail])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}

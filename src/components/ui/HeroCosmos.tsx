import { useEffect, useRef } from 'react'

type Quality = 'desktop' | 'tablet' | 'mobile' | 'static'

interface Star {
  x: number
  y: number
  z: number
  r: number
  a: number
  tw: number
  tws: number
  vx: number
  vy: number
}

interface Orbiter {
  cx: number
  cy: number
  rx: number
  ry: number
  a: number
  speed: number
  size: number
}

function quality(): Quality {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'
  if (window.matchMedia('(max-width: 640px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1024px)').matches) return 'tablet'
  return 'desktop'
}

const COUNTS: Record<Quality, { stars: number; dust: number; orbits: number }> = {
  desktop: { stars: 260, dust: 110, orbits: 3 },
  tablet: { stars: 140, dust: 55, orbits: 2 },
  mobile: { stars: 80, dust: 24, orbits: 0 },
  static: { stars: 100, dust: 0, orbits: 0 },
}

/**
 * Lightweight cosmic canvas — warm ivory palette, soft particles, subtle orbits.
 * Single RAF loop; pauses when off-screen; pointer parallax on desktop only.
 */
export function HeroCosmos() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let q = quality()
    let raf = 0
    let running = true
    let visible = true
    let w = 0
    let h = 0
    let dpr = 1
    let stars: Star[] = []
    let dust: Star[] = []
    let orbits: Orbiter[] = []
    let pointerX = 0
    let pointerY = 0
    let targetParallaxX = 0
    let targetParallaxY = 0
    let parallaxX = 0
    let parallaxY = 0
    const allowPointer = q === 'desktop'

    const seed = () => {
      const c = COUNTS[q]
      stars = Array.from({ length: c.stars }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.15 + Math.random() * 0.85,
        r: 0.45 + Math.random() * 1.55,
        a: 0.18 + Math.random() * 0.42,
        tw: Math.random() * Math.PI * 2,
        tws: 0.35 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.09,
        vy: 0.015 + Math.random() * 0.055,
      }))
      dust = Array.from({ length: c.dust }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.35 + Math.random() * 0.65,
        r: 0.7 + Math.random() * 2.0,
        a: 0.06 + Math.random() * 0.14,
        tw: Math.random() * Math.PI * 2,
        tws: 0.2 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.14,
      }))
      // Orbit centers biased left/right so paths avoid the face
      orbits = Array.from({ length: c.orbits }, (_, i) => ({
        cx: w * (i % 2 === 0 ? 0.28 : 0.72),
        cy: h * (0.32 + (i % 3) * 0.12),
        rx: Math.min(w, h) * (0.2 + i * 0.055),
        ry: Math.min(w, h) * (0.12 + i * 0.035),
        a: Math.random() * Math.PI * 2,
        speed: 0.00032 + i * 0.0001,
        size: 1.3 + i * 0.35,
      }))
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, q === 'mobile' ? 1.25 : 1.75)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (q === 'static') drawFrame(0)
    }

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, w, h)

      // Soft ambient orbs (champagne / olive mist — not neon)
      const g1 = ctx.createRadialGradient(w * 0.5 + parallaxX * 8, h * 0.36 + parallaxY * 6, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.42)
      g1.addColorStop(0, 'rgba(255,255,255,0.22)')
      g1.addColorStop(0.45, 'rgba(232,220,190,0.08)')
      g1.addColorStop(1, 'rgba(232,220,190,0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(w * 0.18 + parallaxX * 4, h * 0.7, 0, w * 0.2, h * 0.72, w * 0.35)
      g2.addColorStop(0, 'rgba(160,150,90,0.06)')
      g2.addColorStop(1, 'rgba(160,150,90,0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      // Orbit paths (very faint) — offset so they avoid face center
      for (const o of orbits) {
        ctx.beginPath()
        ctx.ellipse(o.cx + parallaxX * 10, o.cy + parallaxY * 8, o.rx, o.ry, 0.12, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(90,85,60,0.06)'
        ctx.lineWidth = 1
        ctx.stroke()

        const ox = o.cx + Math.cos(o.a) * o.rx + parallaxX * 10
        const oy = o.cy + Math.sin(o.a) * o.ry + parallaxY * 8
        ctx.beginPath()
        ctx.arc(ox, oy, o.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(120,110,70,0.35)'
        ctx.fill()
        // tiny trail
        ctx.beginPath()
        ctx.arc(ox - Math.cos(o.a) * 10, oy - Math.sin(o.a) * 8, o.size * 0.55, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(120,110,70,0.12)'
        ctx.fill()
      }

      const drawStar = (s: Star, animate: boolean) => {
        const px = s.x + parallaxX * s.z * 14
        const py = s.y + parallaxY * s.z * 10
        const twinkle = animate ? 0.65 + Math.sin(t * s.tws + s.tw) * 0.35 : 0.85
        const alpha = s.a * twinkle
        ctx.beginPath()
        ctx.arc(px, py, s.r * s.z, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(55,50,38,${alpha})`
        ctx.fill()
      }

      for (const s of stars) drawStar(s, q !== 'static')
      for (const s of dust) drawStar(s, q !== 'static')
    }

    const tick = (now: number) => {
      if (!running) return
      if (!visible || q === 'static') {
        raf = requestAnimationFrame(tick)
        return
      }

      parallaxX += (targetParallaxX - parallaxX) * 0.04
      parallaxY += (targetParallaxY - parallaxY) * 0.04
      const t = now * 0.001

      for (const s of stars) {
        s.x += s.vx * s.z
        s.y += s.vy * s.z
        if (s.x < -4) s.x = w + 4
        if (s.x > w + 4) s.x = -4
        if (s.y > h + 4) s.y = -4
        if (s.y < -4) s.y = h + 4
      }
      for (const s of dust) {
        s.x += s.vx * s.z
        s.y += s.vy * s.z
        if (s.x < -6) s.x = w + 6
        if (s.x > w + 6) s.x = -6
        if (s.y < -6) s.y = h + 6
        if (s.y > h + 6) s.y = -6
      }
      for (const o of orbits) o.a += o.speed

      drawFrame(t)
      raf = requestAnimationFrame(tick)
    }

    const onPointer = (e: PointerEvent) => {
      if (!allowPointer) return
      const rect = wrap.getBoundingClientRect()
      pointerX = (e.clientX - rect.left) / rect.width - 0.5
      pointerY = (e.clientY - rect.top) / rect.height - 0.5
      targetParallaxX = pointerX * 0.9
      targetParallaxY = pointerY * 0.7
    }

    const onResize = () => {
      q = quality()
      resize()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && q !== 'static') {
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(tick)
        } else if (!visible) {
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.05 },
    )
    io.observe(wrap)

    resize()
    if (q === 'static') drawFrame(0)
    else raf = requestAnimationFrame(tick)

    window.addEventListener('resize', onResize)
    if (allowPointer) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { isTouchDevice, prefersReducedMotion } from '@/lib/motion'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 28, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 380, damping: 28, mass: 0.35 })

  useEffect(() => {
    if (prefersReducedMotion() || isTouchDevice()) return
    setEnabled(true)

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('a, button, [data-cursor="hover"], input, textarea')
      setHovering(Boolean(interactive))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference md:block"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        aria-hidden="true"
      >
        <motion.div
          className="rounded-full border border-white bg-white"
          animate={{
            width: hovering ? 44 : 10,
            height: hovering ? 44 : 10,
            opacity: hovering ? 0.2 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        />
      </motion.div>
      <style>{`@media (hover: hover) and (pointer: fine) { body { cursor: none; } a, button, input, textarea, [data-cursor="hover"] { cursor: none; } }`}</style>
    </>
  )
}

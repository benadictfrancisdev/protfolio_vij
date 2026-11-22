import { useRef, type ReactNode, type CSSProperties } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { isTouchDevice } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Dimensional glass card — pointer tilt + dynamic lighting.
 * Touch / reduced-motion: static glass surface (no hover dependency).
 */
export function PerspectiveCard({
  children,
  className,
  maxTilt = 10,
  style,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const disabled = reduce || isTouchDevice()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(40)
  const elev = useMotionValue(0)

  const springX = useSpring(rotateX, { stiffness: 240, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 240, damping: 22 })
  const springZ = useSpring(elev, { stiffness: 260, damping: 24 })
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(184,240,0,0.22), transparent 52%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * maxTilt * 2)
    rotateX.set((0.5 - py) * maxTilt * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
    elev.set(10)
    ref.current.style.setProperty('--pointer-x', `${px * 100}%`)
    ref.current.style.setProperty('--pointer-y', `${py * 100}%`)
  }

  function onLeave() {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(40)
    elev.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        {
          ...(style as Record<string, string | number | undefined>),
          rotateX: disabled ? 0 : springX,
          rotateY: disabled ? 0 : springY,
          y: disabled ? 0 : springZ,
          transformStyle: 'preserve-3d',
        } as React.ComponentProps<typeof motion.div>['style']
      }
      className={cn(
        'glass-card group relative overflow-hidden rounded-3xl [perspective:1200px]',
        className,
      )}
      data-cursor="hover"
    >
      {children}
      {!disabled && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
          aria-hidden="true"
        />
      )}
      <div
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
    </motion.div>
  )
}

import { useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { isTouchDevice } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function TiltCard({
  children,
  className,
  maxTilt = 8,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const disabled = reduce || isTouchDevice()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const springX = useSpring(rotateX, { stiffness: 220, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 20 })
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(200,255,0,0.18), transparent 55%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * maxTilt * 2)
    rotateX.set((0.5 - py) * maxTilt * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  function onLeave() {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: disabled ? 0 : springX,
        rotateY: disabled ? 0 : springY,
        transformStyle: 'preserve-3d',
      }}
      className={cn('relative [perspective:1000px]', className)}
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
    </motion.div>
  )
}

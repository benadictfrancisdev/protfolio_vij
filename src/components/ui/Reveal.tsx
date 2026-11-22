import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  amount?: number
  once?: boolean
}

const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  amount = 0.2,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion()
  const offset = 36

  const offsetMap: Record<Direction, { x?: number; y?: number }> = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  }

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, ...offsetMap[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, delay, ease: EASE },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

export function StaggerText({ text, className, delay = 0, stagger = 0.05 }: StaggerTextProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <span className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? { opacity: 0 } : { y: '115%' }}
            animate={reduce ? { opacity: 1 } : { y: '0%' }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

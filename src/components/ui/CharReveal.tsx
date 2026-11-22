import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DURATION, EASE_OUT, STAGGER } from '@/lib/motion'

export function CharReveal({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const chars = Array.from(text)

  return (
    <span className={cn('inline-block', className)} aria-label={text}>
      {chars.map((char, i) => (
        <span key={`${char}-${i}`} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            transition={{
              duration: DURATION.base,
              delay: delay + i * STAGGER.char,
              ease: EASE_OUT,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function RotatingText({
  items,
  interval = 2600,
  className,
}: {
  items: string[]
  interval?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || items.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval)
    return () => clearInterval(id)
  }, [items.length, interval, reduce])

  return (
    <span className={cn('relative inline-flex h-[1.5em] items-center overflow-hidden align-bottom', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

import { motion, useReducedMotion } from 'framer-motion'
import { PORTRAIT_SRC } from '@/data/portrait'
import { cn } from '@/lib/utils'
import { EASE_OUT } from '@/lib/motion'

/**
 * Dimensional portrait frame — uses the current professional headshot only.
 */
export function HeroPortrait({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn('relative mx-auto w-full', className)}
      style={{ width: 'min(100%, 360px, calc(min(58vh, 520px) * 0.8))' }}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 1.35, ease: EASE_OUT }}
    >
      <div className="pointer-events-none absolute -inset-6 rounded-[2.2rem] bg-accent/[0.1] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-accent/15" aria-hidden="true" />
      <div className="pointer-events-none absolute -inset-1.5 rounded-[1.85rem] border border-white/10" aria-hidden="true" />

      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] border border-white/12 bg-elevated shadow-[0_24px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(200,255,0,0.06)] sm:rounded-[1.85rem]"
        initial={reduce ? false : { clipPath: 'inset(14% 12% 14% 12% round 1.6rem)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0% round 1.6rem)' }}
        transition={{ duration: 1.25, delay: 1.45, ease: EASE_OUT }}
      >
        <motion.img
          key={PORTRAIT_SRC}
          src={PORTRAIT_SRC}
          alt="Portrait of Vijetha L"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-[center_22%]"
          initial={reduce ? false : { scale: 1.06, filter: 'brightness(0.55)' }}
          animate={{ scale: 1, filter: 'brightness(1)' }}
          transition={{ duration: 1.4, delay: 1.5, ease: EASE_OUT }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/12" />
      </motion.div>
    </motion.div>
  )
}

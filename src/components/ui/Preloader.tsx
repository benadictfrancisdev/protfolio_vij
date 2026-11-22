import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CharReveal } from '@/components/ui/CharReveal'
import { DURATION, EASE_OUT } from '@/lib/motion'

const SESSION_KEY = 'vl-preloader-seen'

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'boot' | 'brand' | 'exit' | 'done'>('boot')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Skip on repeat visits in the same session, or when motion is reduced.
    const seen = sessionStorage.getItem(SESSION_KEY) === '1'
    if (reduce || seen) {
      setVisible(false)
      setPhase('done')
      onComplete?.()
      return
    }

    const timers = [
      window.setTimeout(() => setPhase('brand'), 420),
      window.setTimeout(() => setPhase('exit'), 2100),
      window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1')
        setVisible(false)
        setPhase('done')
        onComplete?.()
      }, 2900),
    ]

    return () => timers.forEach(clearTimeout)
  }, [reduce, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0c0c0c]"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.85, ease: EASE_OUT },
          }}
          aria-hidden="true"
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'brand' || phase === 'exit' ? 1 : 0.35 }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                'radial-gradient(ellipse 55% 40% at 50% 45%, rgba(138,148,72,0.14), transparent 70%)',
            }}
          />
          <motion.p
            className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:left-10 sm:top-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Initializing system
          </motion.p>
          <motion.p
            className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted sm:right-10 sm:top-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Portfolio 2026
          </motion.p>

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Loading indicator */}
            <motion.div
              className="mb-10 h-px w-16 overflow-hidden bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'boot' ? 1 : 0 }}
            >
              <motion.div
                className="h-full w-full origin-left bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              />
            </motion.div>

            <motion.p
              className="mb-5 font-mono text-[10px] uppercase tracking-[0.4em] text-muted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: DURATION.fast, ease: EASE_OUT }}
            >
              AI / ML Engineer
            </motion.p>

            {(phase === 'brand' || phase === 'exit') && (
              <div className="font-display text-[clamp(3rem,12vw,7rem)] uppercase leading-[0.85] tracking-tight text-text">
                <CharReveal text="VIJETHA L" delay={0.05} />
              </div>
            )}

            <motion.p
              className="mt-6 max-w-xs font-mono text-[10px] uppercase tracking-[0.28em] text-muted/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'brand' ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Building intelligent solutions
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

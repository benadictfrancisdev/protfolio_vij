import { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

export function WordReveal({
  text,
  className,
  highlight,
}: {
  text: string
  className?: string
  /** Phrases to accent (case-insensitive substring match). */
  highlight?: string[]
}) {
  const ref = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const words = el.querySelectorAll<HTMLElement>('[data-word]')
    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.028,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [text])

  const tokens = text.split(/(\s+)/)
  const highlights = (highlight ?? []).map((h) => h.toLowerCase())

  return (
    <p ref={ref} className={cn(className)}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
        const isHighlight = highlights.some((h) => token.toLowerCase().includes(h))
        return (
          <span
            key={i}
            data-word
            className={cn('inline-block', isHighlight && 'text-accent')}
          >
            {token}
          </span>
        )
      })}
    </p>
  )
}

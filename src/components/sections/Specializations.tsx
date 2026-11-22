import { useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { specializations } from '@/data/skills'
import { gsap } from '@/lib/gsap'
import { isTouchDevice, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Specializations() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = sectionRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const grid = root.querySelector('[data-spec-grid]')
      const cards = root.querySelectorAll<HTMLElement>('[data-spec-card]')

      gsap.fromTo(
        cards,
        { opacity: 0, y: 64, rotateX: 8, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.14,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 78%', once: true },
          onComplete: () => {
            cards.forEach((card) => gsap.set(card, { clearProps: 'transform' }))
          },
        },
      )

      gsap.fromTo(
        root.querySelectorAll('[data-spec-index]'),
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.14,
          duration: 0.7,
          delay: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 78%', once: true },
        },
      )

      gsap.fromTo(
        root.querySelectorAll('[data-spec-chip]'),
        { opacity: 0, y: 12, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.04,
          duration: 0.45,
          delay: 0.32,
          ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 78%', once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section section-dark relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 85% 20%, rgba(184,240,0,0.05), transparent 55%), radial-gradient(ellipse 40% 35% at 10% 70%, rgba(255,255,255,0.03), transparent 50%)',
        }}
      />

      <Container className="relative">
        <SectionHeading
          index="03"
          label="Focus"
          title="Engineering Specializations"
          description="The four disciplines that shape how I approach intelligent systems — from model design to deployment."
        />

        <div
          data-spec-grid
          className="mt-14 grid gap-6 md:grid-cols-2"
          style={{ perspective: 1400 }}
        >
          {specializations.map((item, i) => (
            <SpecCard key={item.index} item={item} accent={i % 2 === 0} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function SpecCard({
  item,
  accent,
}: {
  item: (typeof specializations)[number]
  accent: boolean
}) {
  const reduce = useReducedMotion()
  const disabled = reduce || isTouchDevice()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 220, damping: 22 })
  const sry = useSpring(ry, { stiffness: 220, damping: 22 })

  function onMove(e: React.MouseEvent) {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * 12)
    rx.set((0.5 - py) * 10)
    ref.current.style.setProperty('--gx', `${px * 100}%`)
    ref.current.style.setProperty('--gy', `${py * 100}%`)
  }

  return (
    <motion.div
      ref={ref}
      data-spec-card
      data-cursor="hover"
      onMouseMove={onMove}
      onMouseLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      whileHover={
        disabled ? undefined : { y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
      }
      style={{
        rotateX: disabled ? 0 : srx,
        rotateY: disabled ? 0 : sry,
        transformStyle: 'preserve-3d',
        opacity: reduce ? 1 : undefined,
      }}
      className={cn(
        'group relative h-full overflow-hidden rounded-3xl border p-8 transition-[border-color,box-shadow] duration-300',
        // GSAP owns first reveal; hide until then (reduce-motion stays visible)
        !reduce && 'opacity-0',
        accent
          ? 'border-white/10 bg-gradient-to-br from-accent/[0.07] via-white/[0.02] to-transparent hover:border-accent/45 hover:shadow-[0_20px_60px_-28px_rgba(184,240,0,0.35)]'
          : 'border-white/10 bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.04] hover:shadow-[0_20px_50px_-30px_rgba(255,255,255,0.25)]',
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(380px circle at var(--gx, 50%) var(--gy, 40%), rgba(184,240,0,0.14), transparent 55%)',
        }}
      />

      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <span data-spec-index className="font-mono text-xs text-accent">
          {item.index}
        </span>
        <span className="h-px w-10 bg-white/10 transition-all duration-300 group-hover:w-20 group-hover:bg-accent/60" />
      </div>

      <h3 className="relative mt-5 font-display text-2xl uppercase leading-[1.05] tracking-tight text-text transition-colors duration-300 group-hover:text-white sm:text-3xl">
        {item.title}
      </h3>
      <p className="relative mt-4 text-sm leading-relaxed text-muted">{item.description}</p>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {item.tech.map((tech) => (
          <span
            key={tech}
            data-spec-chip
            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted transition-all duration-300 group-hover:border-accent/35 group-hover:text-text"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

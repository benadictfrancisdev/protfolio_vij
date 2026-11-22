import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { specializations } from '@/data/skills'
import { isTouchDevice } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Specializations() {
  return (
    <section className="section section-dark relative">
      <Container>
        <SectionHeading
          index="03"
          label="Focus"
          title="Engineering Specializations"
          description="The four disciplines that shape how I approach intelligent systems — from model design to deployment."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {specializations.map((item, i) => (
            <Reveal key={item.index} delay={i * 0.08}>
              <SpecCard item={item} accent={i % 2 === 0} />
            </Reveal>
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
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })

  function onMove(e: React.MouseEvent) {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * 10)
    rx.set((0.5 - py) * 8)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      style={{ rotateX: disabled ? 0 : srx, rotateY: disabled ? 0 : sry, transformStyle: 'preserve-3d' }}
      className={cn(
        'group relative h-full overflow-hidden rounded-3xl border p-8 transition-colors duration-300',
        accent
          ? 'border-white/10 bg-gradient-to-br from-accent/[0.07] via-white/[0.02] to-transparent hover:border-accent/40'
          : 'border-white/10 bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.04]',
      )}
      data-cursor="hover"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-accent">{item.index}</span>
        <span className="h-px w-10 bg-white/10 transition-all duration-300 group-hover:w-16 group-hover:bg-accent/50" />
      </div>
      <h3 className="mt-5 font-display text-2xl uppercase leading-[1.05] tracking-tight text-text sm:text-3xl">
        {item.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.tech.map((tech) => (
          <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

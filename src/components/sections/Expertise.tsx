import { useLayoutEffect, useRef } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Marquee } from '@/components/ui/Marquee'
import { skillGroups, specializations } from '@/data/skills'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

const MARQUEE = [
  'Machine Learning',
  'Deep Learning',
  'Computer Vision',
  'Generative AI',
  'LLMs',
  'OpenCV',
  'TensorFlow',
  'Keras',
  'CNN',
  'NLP',
]

export function Expertise() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = sectionRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-skill-card]'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="expertise" ref={sectionRef} className="section section-dark relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Marquee items={MARQUEE} className="border-y border-white/10 py-4 text-muted" />

      <Container className="mt-16">
        <SectionHeading
          index="02"
          label="Technical stack"
          title="Technologies I Work With"
          description="A focused stack spanning programming, artificial intelligence, deep learning frameworks and core concepts behind modern AI systems."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group, i) => (
            <div
              key={group.title}
              data-skill-card
              className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                // Root 0{i + 1}
              </p>
              <h3 className="mt-3 text-lg font-medium text-text">{group.title}</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    data-skill-chip
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition-colors group-hover:border-white/20 group-hover:text-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {specializations.map((spec) => (
            <div
              key={spec.index}
              data-skill-card
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-medium text-text">{spec.title}</h3>
                <span className="font-mono text-xs text-muted">{spec.index}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{spec.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {spec.tech.map((t) => (
                  <span key={t} className="rounded-full border border-accent/25 px-3 py-1 text-[11px] text-accent">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

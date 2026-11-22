import { useLayoutEffect, useRef } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Marquee } from '@/components/ui/Marquee'
import { PerspectiveCard } from '@/components/ui/PerspectiveCard'
import { skillGroups, specializations } from '@/data/skills'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import SkillLinks, { skillKey } from './SkillLinks'

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
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      )
      gsap.fromTo(
        root.querySelectorAll('[data-spec-card]'),
        { opacity: 0, y: 56 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.querySelector('[data-spec-grid]'), start: 'top 78%', once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="expertise" ref={sectionRef} className="section section-dark relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(184,240,0,0.06), transparent 55%), radial-gradient(ellipse 50% 45% at 90% 30%, rgba(255,255,255,0.04), transparent 50%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Marquee items={MARQUEE} className="border-y border-white/10 py-4 text-muted" />

      <Container className="relative mt-16">
        <SectionHeading
          index="02"
          label="Technical stack"
          title="Technologies I Work With"
          description="A focused stack spanning programming, artificial intelligence, deep learning frameworks and core concepts behind modern AI systems."
        />

        <SkillLinks>
          <div data-skill-grid className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {skillGroups.map((group, i) => (
              <div key={group.title} data-skill-card data-card>
                <PerspectiveCard className="h-full p-6 sm:p-7" maxTilt={9}>
                  <div className="relative z-[1]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                      // Node 0{i + 1}
                    </p>
                    <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-text">
                      {group.title}
                    </h3>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          data-skill-chip
                          data-skill={skillKey(item)}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-colors duration-300 group-hover:border-accent/35 group-hover:text-text"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </PerspectiveCard>
              </div>
            ))}
          </div>

          <div data-spec-grid className="mt-16 grid gap-5 md:grid-cols-2">
            {specializations.map((spec) => (
              <div key={spec.index} data-spec-card data-skill-card data-card>
                <PerspectiveCard className="h-full p-6 sm:p-8" maxTilt={7}>
                  <div className="relative z-[1]">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-wide text-text sm:text-3xl">
                        {spec.title}
                      </h3>
                      <span className="font-display text-4xl leading-none text-accent/25">{spec.index}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted sm:text-[0.95rem]">
                      {spec.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {spec.tech.map((t) => (
                        <span
                          key={t}
                          data-skill={skillKey(t)}
                          className="rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] text-accent"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </PerspectiveCard>
              </div>
            ))}
          </div>
        </SkillLinks>
      </Container>
    </section>
  )
}

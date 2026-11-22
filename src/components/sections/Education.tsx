import { useLayoutEffect, useRef } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { education } from '@/data/education'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

export function Education() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const reduce = prefersReducedMotion()
    if (reduce || !lineRef.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 75%',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        sectionRef.current!.querySelectorAll('[data-edu-card]'),
        { opacity: 0, x: 36 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.18,
          duration: 0.85,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
            once: true,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="education" className="section section-dark relative">
      <Container>
        <SectionHeading
          index="05"
          label="Education"
          title="Academic Journey"
          description="A consistent academic record across computer science engineering, from undergraduate foundations to an M.Tech specialization."
        />

        <div ref={sectionRef} className="relative mt-16 pl-10 sm:pl-14">
          <div className="absolute left-3 top-0 h-full w-px bg-white/10 sm:left-4" />
          <div ref={lineRef} className="absolute left-3 top-0 h-full w-px origin-top bg-accent sm:left-4" />

          <div className="space-y-10">
            {education.map((entry) => (
              <div key={entry.degree} data-edu-card className="relative">
                <span className="absolute -left-[36px] top-2 grid h-4 w-4 place-items-center rounded-full border border-accent/50 bg-bg sm:-left-[48px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/30 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl uppercase leading-tight tracking-tight text-text">
                      {entry.degree}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{entry.institution}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {entry.grade}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{entry.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

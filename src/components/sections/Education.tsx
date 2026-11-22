import { useLayoutEffect, useRef } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { education } from '@/data/education'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

export function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = sectionRef.current
    const track = trackRef.current
    const line = lineRef.current
    if (!root || !track || !line || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: track,
            start: 'top 72%',
            end: 'bottom 70%',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        track.querySelectorAll('[data-edu-card]'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.16,
          duration: 0.85,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: track,
            start: 'top 72%',
            once: true,
          },
        },
      )

      gsap.fromTo(
        track.querySelectorAll('[data-edu-dot]'),
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.16,
          duration: 0.5,
          ease: 'back.out(1.6)',
          immediateRender: false,
          scrollTrigger: {
            trigger: track,
            start: 'top 72%',
            once: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="education" ref={sectionRef} className="section section-dark relative">
      <Container>
        <SectionHeading
          index="05"
          label="Education"
          title="Academic Journey"
          description="A consistent academic record across computer science engineering, from undergraduate foundations to an M.Tech specialization."
        />

        {/* CSS grid keeps the rail, dots, and cards locked on one alignment axis */}
        <div ref={trackRef} className="relative mt-16">
          <div className="space-y-8 sm:space-y-10">
            {education.map((entry) => (
              <article
                key={entry.degree}
                data-edu-card
                className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-x-5 sm:grid-cols-[20px_minmax(0,1fr)] sm:gap-x-7"
              >
                <div className="relative flex justify-center pt-7">
                  <span
                    data-edu-dot
                    className="relative z-[1] grid h-4 w-4 place-items-center rounded-full border border-accent/50 bg-bg"
                    aria-hidden="true"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                </div>

                <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/30 sm:p-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <h3 className="font-display text-xl uppercase leading-tight tracking-tight text-text sm:text-2xl">
                      {entry.degree}
                    </h3>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      {entry.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{entry.institution}</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {entry.grade}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{entry.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Shared timeline rail ? centered on the 16/20px first column */}
          <div
            className="pointer-events-none absolute bottom-8 left-[7px] top-8 w-px bg-white/10 sm:left-[9px]"
            aria-hidden="true"
          />
          <div
            ref={lineRef}
            className="pointer-events-none absolute bottom-8 left-[7px] top-8 w-px origin-top bg-accent sm:left-[9px]"
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  )
}

import { useLayoutEffect, useRef } from 'react'
import { Container } from '@/components/ui/Container'
import { Portrait } from '@/components/ui/Portrait'
import { personal, stats } from '@/data/personal'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

const FOCUS = [
  { title: 'Computer Vision', note: 'Detection & classification' },
  { title: 'Deep Learning', note: 'CNN & transfer learning' },
  { title: 'Generative AI', note: 'LLMs & applied systems' },
  { title: 'End-to-end AI', note: 'From model to deployment' },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = sectionRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll('[data-about-reveal]'),
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="section section-dark relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl"
        aria-hidden="true"
      />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-about-reveal>
            <div className="relative mx-auto max-w-md">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem]">
                <Portrait variant="about" className="!rounded-[1.75rem]" />
                <div className="absolute inset-x-4 bottom-4 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text backdrop-blur-md">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  {personal.availability}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {stats.slice(0, 4).map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                    <div className="font-display text-2xl text-text">{s.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p
              data-about-reveal
              className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent"
            >
              // System profile
            </p>
            <h2
              data-about-reveal
              className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] uppercase leading-[0.95] tracking-wide text-text"
            >
              Hello, I&apos;m Vijetha L
            </h2>
            <div data-about-reveal className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              {personal.aboutParagraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <div data-about-reveal className="mt-10 grid gap-3 sm:grid-cols-2">
              {FOCUS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-accent/35"
                >
                  <h3 className="text-sm font-medium text-text">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

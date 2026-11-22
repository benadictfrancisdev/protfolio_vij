import { useLayoutEffect, useRef } from 'react'
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { personal } from '@/data/personal'
import { scrollToId, scrollToTop } from '@/lib/smoothScroll'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const META = [
  {
    label: 'Focus',
    value: 'AI / ML · Computer Vision · Generative AI',
  },
  {
    label: 'Status',
    value: personal.availability,
    live: true,
  },
  {
    label: 'Region',
    value: personal.location,
  },
]

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !nameRef.current || !footerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nameRef.current,
        { yPercent: 18, opacity: 0.15 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        footerRef.current!.querySelectorAll('[data-footer-reveal]'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 88%',
            once: true,
          },
        },
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-white/10 pt-16">
      <Container>
        {/* Top row: CTA copy + contacts | back to top — same baseline */}
        <div
          data-footer-reveal
          className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        >
          <div className="min-w-0">
            <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Let&apos;s build something intelligent. Open to AI/ML opportunities, research and
              collaborations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${personal.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-text transition-colors hover:border-accent/40"
              >
                <Mail size={15} className="text-accent" /> {personal.email}
              </a>
              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-text transition-colors hover:border-accent/40"
                >
                  <Linkedin size={15} className="text-accent" /> LinkedIn
                </a>
              )}
              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-text transition-colors hover:border-accent/40"
                >
                  <Github size={15} className="text-accent" /> GitHub
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex h-fit items-center gap-2 justify-self-start rounded-full border border-white/15 px-5 py-3 text-sm text-text transition-colors hover:border-accent hover:text-accent md:justify-self-end"
          >
            Back to top <ArrowUp size={15} />
          </button>
        </div>

        {/* Meta strip — 3 equal columns, aligned */}
        <div
          data-footer-reveal
          className="grid gap-6 border-b border-white/10 py-10 sm:grid-cols-3"
        >
          {META.map((item) => (
            <div key={item.label}>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                // {item.label}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-text sm:text-base">
                {'live' in item && item.live ? (
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                ) : null}
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <nav
          data-footer-reveal
          className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10 py-8"
          aria-label="Footer"
        >
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToId(link.id)}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div ref={nameRef} className="select-none overflow-hidden py-6">
          <div className="bg-gradient-to-b from-white/15 to-white/[0.03] bg-clip-text font-display text-[clamp(3.5rem,18vw,16rem)] uppercase leading-[0.8] tracking-tight text-transparent">
            VIJETHA L
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-white/10 py-6 text-xs text-muted sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Vijetha L. All rights reserved.</span>
          <span>Built with React · TypeScript · GSAP · Motion</span>
        </div>
      </Container>
    </footer>
  )
}

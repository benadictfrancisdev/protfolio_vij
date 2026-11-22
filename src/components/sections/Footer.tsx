import { useLayoutEffect, useRef } from 'react'
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { personal } from '@/data/personal'
import { scrollToId, scrollToTop } from '@/lib/smoothScroll'
import { gsap } from '@/lib/gsap'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !nameRef.current || !footerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        nameRef.current,
        { yPercent: 22, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-white/10 pt-16">
      <Container>
        <div className="flex flex-col gap-10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="max-w-md text-lg leading-relaxed text-muted">
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
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-3 text-sm text-text transition-colors hover:border-accent hover:text-accent md:self-auto"
          >
            Back to top <ArrowUp size={15} />
          </button>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 py-8" aria-label="Footer">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToId(link.id)}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div ref={nameRef} className="select-none">
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

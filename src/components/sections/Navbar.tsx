import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight, Github, Linkedin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { scrollToId, scrollToTop } from '@/lib/smoothScroll'
import { useActiveSection } from '@/hooks/useActiveSection'
import { personal } from '@/data/personal'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(true)
  const active = useActiveSection(['home', ...NAV.map((n) => n.id)])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      // Light/ink nav only over the coat hero; About + rest stay dark
      const hero = document.querySelector('[data-hero-section]')
      if (!hero) {
        setLight(false)
        return
      }
      const rect = hero.getBoundingClientRect()
      setLight(rect.bottom > window.innerHeight * 0.35)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = ''
    }
    return () => {
      document.body.style.overflowY = ''
    }
  }, [open])

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    setOpen(false)
    // Unlock body before scrolling (mobile menu)
    document.body.style.overflowY = ''
    window.requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        light
          ? scrolled
            ? 'border-b border-black/5 bg-[#E9DCC6]/85 backdrop-blur-xl'
            : 'bg-transparent'
          : scrolled
            ? 'border-b border-white/10 bg-[#121212]/85 backdrop-blur-xl'
            : 'bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
              document.body.style.overflowY = ''
              scrollToTop()
            }}
            className={cn(
              'font-sans text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              light ? 'text-[#111]' : 'text-text',
            )}
            aria-label="Vijetha L — back to top"
          >
            Vijetha<span className="text-olive">.</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => onNavClick(e, item.id)}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-[12px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  light
                    ? active === item.id
                      ? 'text-[#111]'
                      : 'text-[#5c574f] hover:text-[#111]'
                    : active === item.id
                      ? 'text-accent'
                      : 'text-muted hover:text-text',
                )}
              >
                {item.label}
                {active === item.id && (
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-px',
                      light ? 'bg-[#111]' : 'bg-accent',
                    )}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => onNavClick(e, 'contact')}
              className={cn(
                'hidden items-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex',
                light
                  ? 'bg-[#111] text-white hover:bg-olive'
                  : 'bg-accent text-black hover:bg-white',
              )}
            >
              Let&apos;s Talk <ArrowUpRight size={14} />
            </a>

            <button
              type="button"
              className={cn(
                'grid h-10 w-10 place-items-center rounded-full border md:hidden',
                light ? 'border-black/15 text-[#111]' : 'border-white/15 text-text',
              )}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#121212] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <Container className="flex h-full flex-col pt-24">
              <nav className="flex flex-col gap-2" aria-label="Mobile">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={(e) => onNavClick(e, item.id)}
                    className="border-b border-white/10 py-4 font-display text-4xl uppercase tracking-wide text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto flex gap-3 pb-10">
                {personal.linkedin && (
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-text"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-text"
                  >
                    <Github size={16} />
                  </a>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

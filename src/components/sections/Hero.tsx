import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HeroCosmos } from '@/components/ui/HeroCosmos'
import { heroIdentities } from '@/data/heroIdentities'
import { scrollToId } from '@/lib/smoothScroll'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

function splitChars(el: HTMLElement | null) {
  if (!el) return [] as HTMLElement[]
  const text = el.textContent ?? ''
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'hero-char inline-block'
    span.style.willChange = 'transform, opacity'
    if (ch === ' ') {
      span.innerHTML = '&nbsp;'
      span.setAttribute('aria-hidden', 'true')
    } else {
      span.textContent = ch
      span.setAttribute('aria-hidden', 'true')
    }
    el.appendChild(span)
    chars.push(span)
  }
  return chars
}

function splitWords(el: HTMLElement | null) {
  if (!el) return [] as HTMLElement[]
  const text = el.textContent ?? ''
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const words: HTMLElement[] = []
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part))
      return
    }
    const wrap = document.createElement('span')
    wrap.className = 'hero-word-wrap inline-block overflow-hidden align-bottom'
    const inner = document.createElement('span')
    inner.className = 'hero-word inline-block'
    inner.style.willChange = 'transform, opacity'
    inner.textContent = part
    inner.setAttribute('aria-hidden', 'true')
    wrap.appendChild(inner)
    el.appendChild(wrap)
    words.push(inner)
  })
  return words
}

/**
 * Cinematic ivory hero — cosmic canvas, portrait entrance, typography stagger,
 * reversible ScrollTrigger scrub. No sticky / pin / scroll trap.
 */
export function Hero({ ready = true }: { ready?: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLParagraphElement>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  // Hold cinematic initial states until preloader hands off
  useLayoutEffect(() => {
    if (ready || prefersReducedMotion()) return
    const portrait = portraitRef.current
    const mask = maskRef.current
    const img = imgRef.current
    if (!portrait || !mask || !img) return
    gsap.set(glowRef.current, { opacity: 0, scale: 0.92 })
    gsap.set(mask, { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(portrait, {
      scale: 0.94,
      rotateX: 4,
      opacity: 0.55,
      transformPerspective: 1400,
    })
    gsap.set(img, { scale: 1.04, yPercent: 2 })
    gsap.set(
      [labelRef.current, headlineRef.current, tagRef.current, descRef.current, ctaRef.current, scrollCueRef.current],
      { opacity: 0 },
    )
  }, [ready])

  useLayoutEffect(() => {
    if (!ready) return

    const root = rootRef.current
    const stage = stageRef.current
    const portrait = portraitRef.current
    const floatEl = floatRef.current
    const mask = maskRef.current
    const img = imgRef.current
    if (!root || !stage || !portrait || !floatEl || !mask || !img) return

    const reduce = prefersReducedMotion()
    const mobile = window.matchMedia('(max-width: 900px)').matches
    const states = heroIdentities.length

    const applyIdentity = (idx: number, commitReact: boolean) => {
      const next = heroIdentities[idx]
      // Only swap plain-text nodes after entrance (identity changes replace split markup)
      if (labelRef.current && !labelRef.current.querySelector('.hero-char')) {
        labelRef.current.textContent = next.label
      }
      if (headlineRef.current && !headlineRef.current.querySelector('.hero-word')) {
        headlineRef.current.textContent = next.headline
      }
      if (tagRef.current) tagRef.current.textContent = next.tag
      if (descRef.current) descRef.current.textContent = next.description
      if (img.getAttribute('src') !== next.image) img.src = next.image
      if (commitReact && idx !== activeRef.current) {
        activeRef.current = idx
        setActive(idx)
      } else {
        activeRef.current = idx
      }
    }

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(
          [portrait, mask, img, leftRef.current, rightRef.current, glowRef.current],
          { clearProps: 'all' },
        )
        return
      }

      // —— Initial states ——
      gsap.set(glowRef.current, { opacity: 0, scale: 0.92 })
      gsap.set(mask, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set(portrait, {
        scale: 0.94,
        rotateX: 4,
        opacity: 0.55,
        transformPerspective: 1400,
        transformOrigin: '50% 50%',
      })
      gsap.set(floatEl, { y: 0, scale: 1 })
      gsap.set(img, { scale: 1.04, yPercent: 2 })

      // Restore parents after preloader hold, then split for reveal
      gsap.set([labelRef.current, headlineRef.current], { opacity: 1 })
      const labelChars = splitChars(labelRef.current)
      const headlineWords = splitWords(headlineRef.current)
      gsap.set(labelChars, { yPercent: 110, opacity: 0 })
      gsap.set(headlineWords, { yPercent: 105, opacity: 0 })
      gsap.set([tagRef.current, descRef.current, ctaRef.current, scrollCueRef.current], {
        opacity: 0,
        y: 18,
      })

      // —— Entrance timeline ——
      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.12,
      })

      intro
        .to(glowRef.current, { opacity: 1, scale: 1, duration: 1.1 }, 0)
        .to(
          mask,
          { clipPath: 'inset(0% 0 0 0)', duration: 1.35, ease: 'power4.inOut' },
          0.15,
        )
        .to(
          portrait,
          {
            scale: 1,
            rotateX: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
          },
          0.2,
        )
        .to(img, { scale: 1, yPercent: 0, duration: 1.45, ease: 'power3.out' }, 0.2)
        .to(
          labelChars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.022,
            ease: 'power3.out',
          },
          0.55,
        )
        .to(
          headlineWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.85,
        )
        .to(
          tagRef.current,
          { opacity: 1, y: 0, duration: 0.55 },
          1.05,
        )
        .to(
          descRef.current,
          { opacity: 1, y: 0, duration: 0.6 },
          1.18,
        )
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.55 },
          1.32,
        )
        .to(
          scrollCueRef.current,
          { opacity: 1, y: 0, duration: 0.5 },
          1.45,
        )

      // Soft continuous float on inner layer (does not fight scroll transforms)
      if (!mobile) {
        gsap.to(floatEl, {
          y: -8,
          scale: 1.012,
          duration: 5.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: intro.duration() + 0.2,
        })
      }

      // —— Scroll scrub (natural height, no pin) ——
      if (!mobile) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.55,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = Math.min(1, Math.max(0, self.progress))
              const scaled = progress * states
              const idx = Math.min(states - 1, Math.floor(scaled))
              if (idx !== activeRef.current) {
                // Flatten split markup once we enter identity scrub so text can swap
                if (labelRef.current?.querySelector('.hero-char')) {
                  labelRef.current.textContent = heroIdentities[idx].label
                }
                if (headlineRef.current?.querySelector('.hero-word')) {
                  headlineRef.current.textContent = heroIdentities[idx].headline
                }
                applyIdentity(idx, true)
              } else if (idx > 0) {
                applyIdentity(idx, false)
              }
            },
          },
        })

        scrollTl
          .to(
            portrait,
            {
              rotateY: 18,
              rotateX: -2,
              scale: 0.96,
              y: 24,
              transformPerspective: 1400,
              ease: 'none',
              duration: 1,
            },
            0,
          )
          .to(
            mask,
            {
              clipPath: 'inset(0% 4% 0% 4%)',
              ease: 'none',
              duration: 1,
            },
            0,
          )
          .to(
            leftRef.current,
            { x: -36, opacity: 0.35, ease: 'none', duration: 1 },
            0,
          )
          .to(
            rightRef.current,
            { x: 36, opacity: 0.4, ease: 'none', duration: 1 },
            0,
          )
          .to(
            glowRef.current,
            { opacity: 0.35, scale: 0.9, ease: 'none', duration: 1 },
            0,
          )
          .to(
            scrollCueRef.current,
            { opacity: 0, y: 12, ease: 'none', duration: 0.35 },
            0,
          )
      }
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = window.setTimeout(refresh, 400)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [ready])

  const identity = heroIdentities[active]

  return (
    <section
      id="home"
      ref={rootRef}
      data-hero-section
      data-nav-theme="light"
      className="relative"
    >
      <div
        ref={stageRef}
        className="hero-stage relative flex min-h-[100svh] flex-col overflow-x-clip text-[#111]"
        style={{
          background:
            'linear-gradient(165deg, #f7f2e8 0%, #efe6d6 42%, #e8dfcf 100%)',
        }}
      >
        <HeroCosmos />

        {/* Soft radial base + portrait glow */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(255,255,255,0.55) 0%, transparent 70%)',
          }}
        />

        <Container className="relative z-10 flex flex-1 flex-col justify-center py-8 pt-[5rem] sm:py-10 sm:pt-[5.5rem]">
          <div
            className={cn(
              'relative grid grid-cols-1 items-center gap-5',
              'md:gap-6',
              'lg:grid-cols-[1.05fr_minmax(240px,0.9fr)_1.05fr] lg:gap-5',
            )}
          >
            <div ref={leftRef} className="order-1 max-w-md lg:order-none">
              <p
                ref={labelRef}
                className="overflow-hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#3a3832] sm:text-[11px]"
              >
                {identity.label}
              </p>
              <h1
                ref={headlineRef}
                className="mt-2 font-display text-[clamp(2.35rem,7.5vw,5.75rem)] leading-[0.88] tracking-[0.02em] text-[#121212] sm:mt-3"
              >
                {identity.headline}
              </h1>
            </div>

            <div className="order-2 flex justify-center lg:order-none">
              <div
                ref={portraitRef}
                className="relative w-full max-w-[min(260px,72vw)] sm:max-w-[min(320px,70vw)] lg:max-w-[min(380px,70vw)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div ref={floatRef} className="relative w-full" style={{ transformStyle: 'preserve-3d' }}>
                  <div
                    ref={glowRef}
                    className="pointer-events-none absolute left-1/2 top-[14%] h-[74%] w-[84%] -translate-x-1/2 rounded-full bg-white/70 blur-3xl"
                    aria-hidden="true"
                  />
                  <div
                    ref={maskRef}
                    className="relative aspect-[3/4] w-full overflow-hidden will-change-[clip-path]"
                    style={{ clipPath: 'inset(0 0 0 0)' }}
                  >
                    <img
                      ref={imgRef}
                      src={heroIdentities[0].image}
                      alt="Portrait of Vijetha L"
                      className="portrait-fade h-full w-full object-cover object-[center_22%]"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={rightRef}
              className="order-3 max-w-md justify-self-start lg:order-none lg:max-w-sm lg:justify-self-end lg:text-right"
            >
              <p
                ref={tagRef}
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5c574f] sm:text-[11px]"
              >
                {identity.tag}
              </p>
              <p
                ref={descRef}
                className="mt-3 text-sm leading-relaxed text-[#4a463f] sm:mt-4 sm:text-[0.95rem]"
              >
                {identity.description}
              </p>
              <div
                ref={ctaRef}
                className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 lg:justify-end"
              >
                <Button variant="light" size="md" onClick={() => scrollToId('projects')}>
                  View My Work <ArrowUpRight size={16} />
                </Button>
                <Button variant="dark" size="md" onClick={() => scrollToId('contact')}>
                  Contact Me
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4 sm:mt-10">
            <p
              ref={scrollCueRef}
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6a655c]"
            >
              <ArrowDown size={12} />
              Scroll to explore
            </p>
            <div className="hidden items-center gap-2 sm:flex" aria-label="Identity stage">
              {heroIdentities.map((s, i) => (
                <span
                  key={s.id}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                    i === active ? 'bg-[#111]' : 'bg-[#111]/2',
                  )}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

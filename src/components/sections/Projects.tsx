import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Github } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { ProjectVisual } from '@/components/projects/ProjectVisual'
import { projects, type Project } from '@/data/projects'
import { cn } from '@/lib/utils'

export function Projects() {
  return (
    <section id="projects" className="section section-dark relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,240,0,0.05),transparent_60%)]" />
      <Container>
        <SectionHeading
          index="04"
          label="Work"
          title="Featured Projects"
          description="Four end-to-end AI applications spanning healthcare diagnostics, object detection, industrial anomaly detection and cybersecurity."
        />

        <div className="mt-16 space-y-24 lg:space-y-36">
          {projects.map((project, i) => (
            <ProjectPanel key={project.id} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -40])
  const numberOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.05, 0.18, 0.18, 0.05])
  const reversed = index % 2 === 1

  return (
    <article ref={ref} className="relative">
      <motion.span
        style={{ opacity: numberOpacity }}
        className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[clamp(5rem,18vw,14rem)] leading-none text-white"
        aria-hidden="true"
      >
        {project.index}
      </motion.span>

      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div style={{ y }} className={cn('lg:col-span-7', reversed && 'lg:order-2')}>
            <TiltCard className="group rounded-3xl">
              <div className="overflow-hidden rounded-3xl border border-white/10 transition-colors duration-500 group-hover:border-accent/40">
                <div className="origin-center transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <ProjectVisual variant={project.visual} className="rounded-none border-0" />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-accent/30" />
              </div>
            </TiltCard>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted/70">
              Abstract technical illustration — not a product screenshot
            </p>
          </motion.div>

          <div className={cn('relative z-10 lg:col-span-5', reversed && 'lg:order-1')}>
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl leading-none text-accent/30">{project.index}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                {project.category}
              </span>
            </div>
            <h3 className="mt-4 font-display text-3xl uppercase leading-[1.02] tracking-tight text-text sm:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-text"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm text-text transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Case study
                <ChevronDown
                  size={16}
                  className={cn('transition-transform duration-300', open && 'rotate-180')}
                />
              </button>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-text transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
                >
                  <Github size={15} />
                  Explore Project
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-2 lg:grid-cols-4">
                <Detail label="Problem" text={project.problem} />
                <Detail label="Solution" text={project.solution} />
                <DetailList label="Approach" items={project.approach} />
                <DetailList label="Outcomes" items={project.outcomes} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </article>
  )
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  )
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{label}</div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

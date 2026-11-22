import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { TiltCard } from '@/components/ui/TiltCard'
import { ProjectVisual } from '@/components/projects/ProjectVisual'
import { projects } from '@/data/projects'
import { cn } from '@/lib/utils'

export function Projects() {
  return (
    <section id="projects" className="section section-dark relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,148,72,0.06),transparent_60%)]" />
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

function ProjectPanel({
  project,
  index,
}: {
  project: (typeof projects)[number]
  index: number
}) {
  const ref = useRef<HTMLElement>(null)
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
        className="pointer-events-none absolute -top-10 right-0 font-display text-[clamp(5rem,18vw,14rem)] leading-none text-white select-none"
        aria-hidden="true"
      >
        {project.index}
      </motion.span>

      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div style={{ y }} className={cn('lg:col-span-7', reversed && 'lg:order-2')}>
            <TiltCard className="group rounded-3xl">
              <div className="overflow-hidden rounded-3xl border border-white/10 transition-colors duration-500 group-hover:border-accent/40">
                <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04]">
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
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-text transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              >
                <Github size={15} />
                Explore Project
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-2 lg:grid-cols-4">
          <Detail label="Problem" text={project.problem} />
          <Detail label="Solution" text={project.solution} />
          <DetailList label="Approach" items={project.approach} />
          <DetailList label="Outcomes" items={project.outcomes} />
        </div>
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

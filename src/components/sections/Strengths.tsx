import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { strengths } from '@/data/skills'

export function Strengths() {
  return (
    <section className="section section-dark relative">
      <Container>
        <SectionHeading
          index="07"
          label="Strengths"
          title="Professional Strengths"
          description="The working qualities I bring to research, engineering and collaborative problem-solving."
        />

        <div className="mt-12 border-y border-white/10">
          {strengths.map((strength, i) => (
            <Reveal key={strength} delay={i * 0.04}>
              <div className="group flex items-center justify-between gap-6 border-b border-white/10 py-6 transition-colors last:border-b-0 hover:bg-white/[0.02] sm:py-8">
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                  <span className="font-display text-3xl uppercase leading-none tracking-tight text-text transition-colors group-hover:text-accent sm:text-5xl">
                    {strength}
                  </span>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:block">
                  Strength
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

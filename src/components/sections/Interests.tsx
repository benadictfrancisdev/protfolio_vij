import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { interests } from '@/data/skills'

export function Interests() {
  return (
    <section className="section section-dark relative">
      <Container>
        <SectionHeading
          index="08"
          label="Interests"
          title="Areas of Interest"
          description="The research and application areas I am most excited to keep building in."
        />

        <div className="mt-12 flex flex-wrap gap-3">
          {interests.map((interest, i) => (
            <Reveal key={interest} delay={i * 0.04}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-muted transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:text-text sm:px-6 sm:py-4 sm:text-base">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {interest}
              </span>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

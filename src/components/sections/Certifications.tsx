import { Award } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { certifications } from '@/data/education'

export function Certifications() {
  return (
    <section id="certifications" className="section section-dark relative">
      <Container>
        <SectionHeading
          index="06"
          label="Credentials"
          title="Certifications"
          description="Professional certifications validating foundations in artificial intelligence, software engineering and web development."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 0.05}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-accent transition-colors group-hover:border-accent/40">
                    <Award size={18} />
                  </span>
                  <span className="font-mono text-[10px] text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-sm font-medium leading-snug text-text">{cert.title}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {cert.issuer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

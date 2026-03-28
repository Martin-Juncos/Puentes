import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { approachPillars } from '@/constants/siteContent'

export const ApproachPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <SectionHeading
      description="La modalidad de acompañamiento se sostiene en el vínculo con cada niño, en la articulación con adultos referentes y en una organización interna capaz de dar continuidad a los procesos."
      eyebrow="Modalidad de acompañamiento"
      title="Una práctica clínica, institucional y operativa al mismo tiempo."
    />

    <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <img alt="Modalidad de acompañamiento" className="h-full min-h-96 w-full rounded-[2rem] object-cover" src="/media/8.jpg" />
      <div className="grid gap-4">
        {approachPillars.map((pillar) => (
          <PanelCard key={pillar}>
            <p className="text-lg font-semibold text-[var(--color-primary)]">{pillar}</p>
          </PanelCard>
        ))}
      </div>
    </div>
  </div>
)

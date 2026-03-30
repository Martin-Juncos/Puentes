import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { approachPillars } from '@/constants/siteContent'
import { media } from '@/constants/media'

export const ApproachPage = () => (
  <div className="public-shell py-16 lg:py-24">
    <SectionHeading
      description="La modalidad de acompañamiento se sostiene en el vínculo con cada niño, en la articulación con adultos referentes y en una organización interna capaz de dar continuidad a los procesos."
      eyebrow="Modalidad de acompañamiento"
      title="Una práctica clínica, institucional y operativa al mismo tiempo."
    />

    <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-center">
      <div className="public-media-frame mx-auto w-full max-w-sm p-4 lg:max-w-none">
        <img
          alt={media.approachHero.alt}
          className="h-64 w-full rounded-[2rem] object-cover sm:h-72 lg:h-[22rem]"
          src={media.approachHero.src}
        />
      </div>
      <div className="grid gap-4">
        {approachPillars.map((pillar) => (
          <PanelCard key={pillar} variant="form">
            <p className="text-lg font-semibold text-[var(--color-primary)]">{pillar}</p>
          </PanelCard>
        ))}
      </div>
    </div>
  </div>
)

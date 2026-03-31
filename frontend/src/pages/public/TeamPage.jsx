import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ProfessionalCard } from '@/components/ui/ProfessionalCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { professionalsService } from '@/services/professionalsService'

export const TeamPage = () => {
  const { data: professionals, isLoading } = useAsyncData(() => professionalsService.listPublic(), [])

  if (isLoading) {
    return <LoadingScreen message="Cargando equipo..." />
  }

  return (
    <div className="public-shell py-16 lg:py-24">
      <SectionHeading
        description="El equipo se organiza para que la experiencia institucional, el vínculo con las familias y la operación del centro estén verdaderamente articulados."
        eyebrow="Equipo"
        title="Profesionales y coordinación con una mirada compartida."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-center">
        <div className="public-media-frame mx-auto w-full max-w-sm p-4 lg:max-w-none">
          <img
            alt={media.teamSupport.alt}
            className="h-64 w-full rounded-[2rem] object-cover sm:h-72 lg:h-[24rem]"
            src={media.teamSupport.src}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {professionals.map((professional, index) => (
            <ProfessionalCard key={professional.id} professional={professional} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

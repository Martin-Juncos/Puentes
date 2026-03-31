import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { ProfessionalCard } from '@/components/ui/ProfessionalCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
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

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {professionals.map((professional, index) => (
          <ProfessionalCard key={professional.id} professional={professional} index={index} />
        ))}
      </div>
    </div>
  )
}

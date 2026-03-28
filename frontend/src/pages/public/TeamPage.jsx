import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useAsyncData } from '@/hooks/useAsyncData'
import { professionalsService } from '@/services/professionalsService'

export const TeamPage = () => {
  const { data: professionals, isLoading } = useAsyncData(() => professionalsService.listPublic(), [])

  if (isLoading) {
    return <LoadingScreen message="Cargando equipo..." />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        description="El equipo se organiza para que la experiencia institucional, el vínculo con las familias y la operación del centro estén verdaderamente articulados."
        eyebrow="Equipo"
        title="Profesionales y coordinación con una mirada compartida."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {professionals.map((professional, index) => (
          <PanelCard className="grid gap-6 md:grid-cols-[120px_1fr]" key={professional.id}>
            <div
              className="flex h-28 w-28 items-center justify-center rounded-[1.7rem] text-3xl font-bold text-white"
              style={{ backgroundColor: professional.calendarColor || (index % 2 === 0 ? '#2F5D73' : '#A7C4B5') }}
            >
              {professional.user.fullName.charAt(0)}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">{professional.discipline}</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{professional.user.fullName}</h3>
              <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.75)]">
                {professional.bio || 'Perfil profesional preparado para ampliarse desde el panel institucional.'}
              </p>
            </div>
          </PanelCard>
        ))}
      </div>
    </div>
  )
}

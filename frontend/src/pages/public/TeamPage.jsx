import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PanelCard } from '@/components/ui/PanelCard'
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
            <PanelCard className="h-full" key={professional.id} variant="form">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-[1.7rem] text-3xl font-bold text-white"
                style={{ backgroundColor: professional.calendarColor || (index % 2 === 0 ? '#2F5D73' : '#A7C4B5') }}
              >
                {professional.user.fullName.charAt(0)}
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">{professional.discipline}</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{professional.user.fullName}</h3>
              <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.75)]">
                {professional.bio || 'Perfil profesional preparado para ampliarse desde el panel institucional.'}
              </p>
            </PanelCard>
          ))}
        </div>
      </div>
    </div>
  )
}

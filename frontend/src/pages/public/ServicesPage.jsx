import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { servicesService } from '@/services/servicesService'

export const ServicesPage = () => {
  const { data: services, isLoading } = useAsyncData(() => servicesService.listPublic(), [])

  if (isLoading) {
    return <LoadingScreen message="Cargando servicios..." />
  }

  return (
    <div className="public-shell py-16 lg:py-24">
      <SectionHeading
        description="Los servicios del centro se presentan como una red de trabajo articulada: orientación inicial, acompañamiento sostenido y encuentros con familias."
        eyebrow="Servicios"
        title="Puentes organiza su propuesta desde la claridad institucional y el seguimiento real."
      />

      <div className="public-media-frame mt-12 p-4">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-center">
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <img
              alt={media.servicesHero.alt}
              className="h-64 w-full rounded-[2rem] object-cover sm:h-72 lg:h-[22rem]"
              src={media.servicesHero.src}
            />
          </div>
          <div className="flex flex-col justify-center rounded-[1.75rem] bg-white/82 px-6 py-8">
            <p className="eyebrow-label">Red de trabajo</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">
              Cada servicio responde a una necesidad concreta y a una lógica institucional común.
            </h2>
            <p className="mt-4 text-sm leading-8 text-[rgba(46,46,46,0.74)]">
              Orientamos la consulta, sostenemos procesos y articulamos intervenciones con una experiencia más clara
              para el centro, el equipo y las familias.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <PanelCard key={service.id} variant="form">
            <div className="h-2 w-20 rounded-full" style={{ backgroundColor: service.colorTag || '#2F5D73' }} />
            <h3 className="mt-5 text-2xl font-semibold text-[var(--color-primary)]">{service.name}</h3>
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.74)]">{service.description}</p>
            <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">
              Duración de referencia: {service.durationMinutes} min
            </p>
          </PanelCard>
        ))}
      </div>
    </div>
  )
}

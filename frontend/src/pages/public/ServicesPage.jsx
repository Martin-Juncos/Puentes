import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
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

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {services.map((service) => (
          <PanelCard key={service.id}>
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

import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

export const NewsPage = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <SectionHeading
      description="La estructura del sitio ya deja preparada esta sección para crecer hacia novedades, recursos y materiales institucionales administrables."
      eyebrow="Base preparada"
      title="La sección de novedades queda lista para una segunda etapa."
    />
    <PanelCard className="mt-10 bg-white/80">
      <p className="text-sm leading-7 text-[rgba(46,46,46,0.75)]">
        En esta primera iteración, Puentes prioriza identidad institucional y operación interna. La arquitectura deja el espacio listo para sumar blog, noticias y recursos sin desordenar el MVP.
      </p>
    </PanelCard>
  </div>
)

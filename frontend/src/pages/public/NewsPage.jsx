import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'

export const NewsPage = () => (
  <div className="public-shell py-16 lg:py-24">
    <SectionHeading
      description="La estructura del sitio ya deja preparada esta sección para crecer hacia novedades, recursos y materiales institucionales administrables."
      eyebrow="Base preparada"
      title="La sección de novedades queda lista para una segunda etapa."
    />

    <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="public-media-frame p-4">
        <img alt={media.newsTeaser.alt} className="h-full min-h-80 w-full rounded-[2rem] object-cover" src={media.newsTeaser.src} />
      </div>

      <PanelCard className="bg-white/80" padding="lg" variant="form">
        <p className="text-sm leading-8 text-[rgba(46,46,46,0.75)]">
          En esta primera iteración, Puentes prioriza identidad institucional y operación interna. La arquitectura deja
          el espacio listo para sumar blog, noticias y recursos sin desordenar el MVP.
        </p>
      </PanelCard>
    </div>
  </div>
)

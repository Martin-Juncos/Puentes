import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'

const approachSections = [
  {
    title: 'Acompañamiento del desarrollo infantil',
    description:
      'En Puentes acompañamos el desarrollo infantil desde una mirada integral, respetuosa y centrada en la singularidad de cada niño. Entendemos que cada proceso requiere tiempos, estrategias y objetivos propios, por eso construimos recorridos de acompañamiento personalizados, orientados a fortalecer habilidades, favorecer la autonomía y potenciar las posibilidades de crecimiento en las distintas áreas del desarrollo.',
    image: media.approachDevelopmentSupport.src,
    imageAlt: media.approachDevelopmentSupport.alt,
  },
  {
    title: 'Trabajo interdisciplinario con equipo y familias',
    description:
      'Nuestra modalidad de acompañamiento se sostiene en el trabajo articulado entre profesionales y familias, entendiendo que el desarrollo infantil se construye en vínculo y en contextos compartidos. La articulación interdisciplinaria nos permite integrar distintas miradas y herramientas, mientras que el intercambio con las familias fortalece la coherencia de las estrategias y el acompañamiento cotidiano de cada niño.',
    image: media.approachInterdisciplinaryWork.src,
    imageAlt: media.approachInterdisciplinaryWork.alt,
  },
  {
    title: 'Seguimiento operativo y profesional claro',
    description:
      'En Puentes priorizamos un seguimiento organizado, sostenido y profesional de cada proceso. Esto implica planificar intervenciones, registrar avances, revisar objetivos y dar continuidad al acompañamiento de manera clara y ordenada. Buscamos que cada familia pueda comprender cómo se desarrolla el recorrido, cuáles son sus propósitos y de qué manera se van construyendo los avances a lo largo del tiempo.',
    image: media.approachOperationalFollowUp.src,
    imageAlt: media.approachOperationalFollowUp.alt,
  },
  {
    title: 'Comunicación institucional cercana y consistente',
    description:
      'Creemos que una comunicación clara, respetuosa y accesible es parte fundamental del acompañamiento. Por eso sostenemos una comunicación institucional cercana y consistente, que favorece el vínculo con las familias, la orientación oportuna y la construcción de confianza. Nuestro objetivo es que cada familia encuentre en Puentes un espacio disponible para escuchar, informar, acompañar y sostener cada proceso con calidez y responsabilidad.',
    image: media.approachInstitutionalCommunication.src,
    imageAlt: media.approachInstitutionalCommunication.alt,
  },
]

export const ApproachPage = () => (
  <div className="public-shell py-16 lg:py-24">
    <SectionHeading
      description="La modalidad de acompañamiento en Puentes articula desarrollo infantil, trabajo con familias, organización profesional y una comunicación cercana que dé continuidad a cada proceso."
      eyebrow="Modalidad de acompañamiento"
      title="Una práctica sostenida, clara y humana para acompañar cada recorrido."
    />

    <div className="mt-12 grid gap-6 xl:grid-cols-2">
      {approachSections.map((section) => (
        <PanelCard className="h-full overflow-hidden bg-white/95" key={section.title} padding="sm" variant="form">
          <div className="public-media-frame p-3">
            <img
              alt={section.imageAlt}
              className="h-64 w-full rounded-[1.75rem] object-cover sm:h-72"
              src={section.image}
            />
          </div>

          <div className="px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
            <p className="eyebrow-label">Modalidad de acompañamiento</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">{section.title}</h2>
            <p className="mt-4 text-sm leading-8 text-[rgba(46,46,46,0.76)]">{section.description}</p>
          </div>
        </PanelCard>
      ))}
    </div>
  </div>
)

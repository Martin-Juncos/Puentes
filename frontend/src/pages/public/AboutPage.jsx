import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { media } from '@/constants/media'

const aboutSections = [
  {
    title: 'Mirada interdisciplinaria',
    description:
      'En Puentes entendemos que el desarrollo infantil requiere una comprensión amplia, integral y respetuosa de cada proceso. Por eso trabajamos desde una mirada interdisciplinaria, en la que distintos saberes y profesionales se articulan para construir una lectura más completa de las necesidades, fortalezas y posibilidades de cada niño. Esta forma de trabajo nos permite diseñar acompañamientos más personalizados, enriquecidos y coherentes, siempre centrados en la singularidad de cada infancia.',
    image: media.trustSupport.src,
    imageAlt: 'Mirada interdisciplinaria en Puentes',
  },
  {
    title: 'Trabajo articulado con familias',
    description:
      'Consideramos que las familias ocupan un lugar fundamental en cada proceso de desarrollo. En Puentes promovemos un trabajo articulado, cercano y sostenido con madres, padres y cuidadores, generando espacios de escucha, orientación e intercambio. Creemos que acompañar a un niño también implica acompañar a su entorno, fortaleciendo la comunicación, compartiendo herramientas y construyendo estrategias conjuntas que puedan sostenerse tanto dentro como fuera del centro.',
    image: media.newsTeaser.src,
    imageAlt: media.newsTeaser.alt,
  },
  {
    title: 'Presencia institucional confiable',
    description:
      'Puentes busca ser un espacio que transmita confianza, seriedad y calidez desde cada uno de sus ámbitos de trabajo. Nuestra presencia institucional se construye a partir del compromiso profesional, la claridad en la comunicación, el respeto por cada familia y la responsabilidad con la que acompañamos cada situación. Nos proponemos ofrecer un entorno cuidado, humano y profesional, donde las familias encuentren orientación, respaldo y la tranquilidad de saberse acompañadas.',
    image: media.loginPanel.src,
    imageAlt: 'Presencia institucional confiable de Puentes',
  },
  {
    title: 'Seguimiento consistente y situado',
    description:
      'Cada niño transita un recorrido singular, por eso en Puentes sostenemos un seguimiento consistente y situado, atento a los tiempos, contextos y necesidades de cada proceso. Esto implica observar, registrar, revisar y acompañar de manera continua, evitando intervenciones aisladas o descontextualizadas. Nuestro objetivo es construir acompañamientos sostenidos en el tiempo, con sentido, coherencia y sensibilidad, ajustados a la realidad concreta de cada niño y su familia.',
    image: media.aboutFollowUp.src,
    imageAlt: media.aboutFollowUp.alt,
  },
]

export const AboutPage = () => (
  <div className="public-shell py-16 lg:py-24">
    <SectionHeading
      description="Puentes acompaña procesos de desarrollo infantil desde una propuesta institucional que articula lectura clínica, trabajo con familias y seguimiento sostenido."
      eyebrow="Sobre Puentes"
      title="Una presencia humana y profesional para acompañar cada proceso con continuidad."
    />

    <div className="mt-12 grid gap-6 xl:grid-cols-2">
      {aboutSections.map((section) => (
        <PanelCard className="h-full overflow-hidden bg-white/95" key={section.title} padding="sm" variant="form">
          <div className="public-media-frame p-3">
            <img
              alt={section.imageAlt}
              className="h-64 w-full rounded-[1.75rem] object-cover sm:h-72"
              src={section.image}
            />
          </div>

          <div className="px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
            <p className="eyebrow-label">Sobre Puentes</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">{section.title}</h2>
            <p className="mt-4 text-sm leading-8 text-[rgba(46,46,46,0.76)]">{section.description}</p>
          </div>
        </PanelCard>
      ))}
    </div>
  </div>
)

import { SectionHeading } from '@/components/ui/SectionHeading'
import { PanelCard } from '@/components/ui/PanelCard'

const values = [
  'Mirada interdisciplinaria',
  'Trabajo articulado con familias',
  'Presencia institucional confiable',
  'Seguimiento consistente y situado',
]

export const AboutPage = () => (
  <div className="public-shell py-16 lg:py-24">
    <SectionHeading
      description="Puentes acompaña procesos de desarrollo infantil poniendo en relación la clínica cotidiana, la orientación a familias y la organización del trabajo del equipo."
      eyebrow="Sobre Puentes"
      title="Una plataforma y un centro que sostienen continuidad, escucha y organización."
    />

    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <img alt="Puentes institucional" className="h-full min-h-96 w-full rounded-[2rem] object-cover" src="/media/4.jpg" />
      <PanelCard>
        <p className="text-sm leading-8 text-[rgba(46,46,46,0.75)]">
          La propuesta de Puentes se apoya en una identidad institucional cálida y profesional, capaz de alojar consultas, ordenar procesos y facilitar el trabajo conjunto entre secretaría, profesionales, coordinación y familias.
        </p>
        <div className="mt-8 grid gap-4">
          {values.map((value) => (
            <div
              className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-4 text-sm font-medium text-[var(--color-primary)]"
              key={value}
            >
              {value}
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  </div>
)

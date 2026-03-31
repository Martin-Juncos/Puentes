import { getProfessionalPhoto } from '@/constants/media'
import { cn } from '@/utils/cn'

import { PanelCard } from '@/components/ui/PanelCard'

export const ProfessionalCard = ({
  professional,
  index = 0,
  className,
  titleAs = 'h3',
  bioFallback = 'Perfil profesional preparado para ampliarse desde el panel institucional.',
}) => {
  const accentColor = professional.calendarColor || (index % 2 === 0 ? '#2F5D73' : '#A7C4B5')
  const professionalPhoto = getProfessionalPhoto(professional.user.fullName)

  return (
    <PanelCard className={cn('h-full bg-white/95', className)} variant="form">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="absolute inset-x-4 top-2 h-full rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(47,93,115,0.1),rgba(167,196,181,0.04))] blur-xl" />

          <div className="relative h-28 w-28 overflow-hidden rounded-[1.75rem] border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] shadow-[0_18px_45px_rgba(47,93,115,0.12)]">
            {professionalPhoto ? (
              <img alt={professionalPhoto.alt} className="h-full w-full object-cover" src={professionalPhoto.src} />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {professional.user.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[rgba(247,244,238,0.86)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
            {professional.discipline}
          </div>

          {titleAs === 'h2' ? (
            <h2 className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">{professional.user.fullName}</h2>
          ) : (
            <h3 className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">{professional.user.fullName}</h3>
          )}

          <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.75)]">{professional.bio || bioFallback}</p>
        </div>
      </div>
    </PanelCard>
  )
}

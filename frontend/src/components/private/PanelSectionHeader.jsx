import { cn } from '@/utils/cn'

export const PanelSectionHeader = ({ icon: Icon, title, description, actions, className }) => (
  <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
    <div className="flex items-start gap-3">
      {Icon ? (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
          <Icon aria-hidden="true" className="size-5" />
        </div>
      ) : null}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[rgba(46,46,46,0.68)]">{description}</p>
        ) : null}
      </div>
    </div>

    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
)

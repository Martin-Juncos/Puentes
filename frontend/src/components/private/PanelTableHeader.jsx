import { Badge } from '@/components/ui/Badge'

export const PanelTableHeader = ({ countLabel, description, title }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-[var(--color-primary)]">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">{description}</p>
      ) : null}
    </div>

    {countLabel ? <Badge>{countLabel}</Badge> : null}
  </div>
)

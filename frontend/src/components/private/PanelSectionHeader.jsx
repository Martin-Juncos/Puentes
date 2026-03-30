export const PanelSectionHeader = ({ icon: Icon, title, description, actions }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex items-start gap-3">
      {Icon ? (
        <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
          <Icon aria-hidden="true" className="size-5" />
        </div>
      ) : null}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-7 text-[rgba(46,46,46,0.68)]">{description}</p>
        ) : null}
      </div>
    </div>

    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
)

export const SelectionStateCard = ({
  action,
  emptyText,
  lines = [],
  title,
}) =>
  title ? (
    <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[rgba(46,46,46,0.74)]">
      <p className="font-semibold text-[var(--color-primary)]">{title}</p>
      {lines.map((line) => (
        <p className="mt-1" key={line}>
          {line}
        </p>
      ))}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-3 text-sm text-[rgba(46,46,46,0.64)]">
      {emptyText}
    </div>
  )

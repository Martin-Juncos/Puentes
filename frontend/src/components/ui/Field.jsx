export const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-[var(--color-primary)]">{label}</span>
    {children}
    {hint ? <span className="mt-2 block text-xs text-[rgba(46,46,46,0.62)]">{hint}</span> : null}
  </label>
)

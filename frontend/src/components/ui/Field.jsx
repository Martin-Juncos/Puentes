import { cn } from '@/utils/cn'

export const Field = ({
  children,
  className,
  error,
  hint,
  label,
  labelClassName,
  required = false,
}) => (
  <label className={cn('block', className)}>
    {label ? (
      <span className={cn('field-label', labelClassName)}>
        {label}
        {required ? <span className="field-label__required">*</span> : null}
      </span>
    ) : null}
    {children}
    {hint ? <span className="field-hint">{hint}</span> : null}
    {error ? <span className="field-error">{error}</span> : null}
  </label>
)

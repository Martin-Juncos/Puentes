import { cn } from '@/utils/cn'

const variants = {
  default: '',
  muted: 'surface-card--muted',
  highlight: 'surface-card--highlight',
  metric: 'surface-card--metric',
  form: 'surface-card--form',
}

const paddings = {
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
}

export const PanelCard = ({
  children,
  className,
  padding = 'md',
  variant = 'default',
}) => (
  <div className={cn('surface-card', variants[variant], paddings[padding] ?? paddings.md, className)}>
    {children}
  </div>
)

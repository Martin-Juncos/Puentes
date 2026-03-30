import { cn } from '@/utils/cn'

export const InlineLoader = ({ className, label = 'Cargando...' }) => (
  <div className={cn('inline-loader', className)} role="status">
    <span aria-hidden="true" className="inline-loader__spinner" />
    <span>{label}</span>
  </div>
)

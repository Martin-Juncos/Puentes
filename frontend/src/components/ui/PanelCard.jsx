import { cn } from '@/utils/cn'

export const PanelCard = ({ className, children }) => (
  <div className={cn('surface-card p-6', className)}>{children}</div>
)

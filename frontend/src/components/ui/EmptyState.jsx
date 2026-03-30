import { FiInbox } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const EmptyState = ({
  action,
  className,
  description,
  icon: Icon = FiInbox,
  title = 'Todavía no hay información',
}) => (
  <div className={cn('empty-state', className)}>
    <div className="flex items-start gap-3">
      {Icon ? (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]">
          <Icon aria-hidden="true" className="size-5" />
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="empty-state__title">{title}</p>
        {description ? <p className="empty-state__description">{description}</p> : null}
      </div>
    </div>

    {action ? (
      <div className="mt-4">
        {action.to ? (
          <Button as={action.as} className={action.className} size={action.size} to={action.to} variant={action.variant}>
            {action.label}
          </Button>
        ) : (
          <Button
            className={action.className}
            onClick={action.onClick}
            size={action.size}
            type={action.type}
            variant={action.variant}
          >
            {action.label}
          </Button>
        )}
      </div>
    ) : null}
  </div>
)

import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

export const PageHeader = ({
  actions,
  className,
  description,
  eyebrow,
  meta,
  title,
}) => (
  <header className={cn('page-header', className)}>
    <div className="page-header__content">
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <div>
        <h1 className="page-header__title">{title}</h1>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
      {meta ? <div className="page-header__meta">{meta}</div> : null}
    </div>
    {actions ? <div className="page-header__actions">{actions}</div> : null}
  </header>
)

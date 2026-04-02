import { cn } from '@/utils/cn'

export const IdentityTextStack = ({
  className,
  subtitle,
  subtitleClassName,
  title,
  titleClassName,
  truncate = false,
}) => {
  if (!title && !subtitle) {
    return null
  }

  const truncateClassName = truncate ? 'truncate' : ''

  return (
    <div className={cn('grid min-w-0 gap-1', className)}>
      {title ? (
        <p
          className={cn(
            truncateClassName,
            'text-[0.9rem] font-semibold leading-[1.15] text-[var(--color-primary)]',
            titleClassName,
          )}
          title={typeof title === 'string' ? title : undefined}
        >
          {title}
        </p>
      ) : null}

      {subtitle ? (
        <p
          className={cn(
            truncateClassName,
            'text-[0.6rem] uppercase tracking-[0.16em] leading-[1.25] text-[rgba(47,93,115,0.62)]',
            subtitleClassName,
          )}
          title={typeof subtitle === 'string' ? subtitle : undefined}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

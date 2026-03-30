import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const IconButton = ({
  'aria-label': ariaLabel,
  children,
  className,
  size = 'icon',
  title,
  variant = 'outline',
  ...props
}) => (
  <Button
    aria-label={ariaLabel}
    className={cn('shrink-0', className)}
    size={size}
    title={title}
    variant={variant}
    {...props}
  >
    {children}
  </Button>
)

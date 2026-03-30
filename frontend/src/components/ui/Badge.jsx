import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)]',
  neutral: 'bg-[var(--color-neutral-bg)] text-[var(--color-neutral-text)]',
  accent: 'bg-[rgba(217,140,122,0.16)] text-[var(--color-accent-strong)]',
}

export const Badge = ({ children, className, variant = 'primary' }) => (
  <span
    className={cn(
      'inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]',
      variants[variant] ?? variants.primary,
      className,
    )}
  >
    {children}
  </span>
)

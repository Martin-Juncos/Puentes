import { createElement } from 'react'

import { cn } from '@/utils/cn'

const variants = {
  primary:
    'border border-transparent bg-[var(--color-primary)] text-white hover:bg-[#24495b] focus-visible:ring-[var(--color-focus-ring)]',
  secondary:
    'border border-transparent bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[#93b4a4] focus-visible:ring-[rgba(167,196,181,0.34)]',
  outline:
    'border border-[var(--color-border-soft)] bg-white text-[var(--color-primary)] hover:bg-[rgba(47,93,115,0.04)] focus-visible:ring-[var(--color-focus-ring)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--color-primary)] hover:bg-[rgba(47,93,115,0.06)] focus-visible:ring-[var(--color-focus-ring)]',
  destructive:
    'border border-transparent bg-[#b75f50] text-white hover:bg-[#9f4f43] focus-visible:ring-[rgba(183,95,80,0.22)]',
  subtle:
    'border border-transparent bg-[rgba(47,93,115,0.08)] text-[var(--color-primary)] hover:bg-[rgba(47,93,115,0.12)] focus-visible:ring-[var(--color-focus-ring)]',
}

const sizes = {
  sm: 'min-h-10 px-4 py-2.5 text-sm',
  md: 'min-h-11 px-5 py-3 text-sm',
  lg: 'min-h-12 px-6 py-3.5 text-base',
  icon: 'size-11 p-0',
}

export const Button = ({
  as = 'button',
  className,
  size = 'md',
  variant = 'primary',
  type,
  ...props
}) =>
  createElement(as, {
    className: cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors transition-transform duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
      as === 'button' ? 'active:translate-y-[1px]' : '',
      variants[variant] ?? variants.primary,
      sizes[size] ?? sizes.md,
      className,
    ),
    type: type ?? (as === 'button' ? 'button' : undefined),
    ...props,
  })

import { createElement } from 'react'

import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[#24495b]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[#93b4a4]',
  outline: 'border border-[rgba(47,93,115,0.18)] bg-white text-[var(--color-primary)] hover:bg-[rgba(47,93,115,0.04)]',
  ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-[rgba(47,93,115,0.06)]',
}

export const Button = ({
  as = 'button',
  className,
  variant = 'primary',
  ...props
}) =>
  createElement(as, {
    className: cn(
      'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      className,
    ),
    ...props,
  })

import { createElement } from 'react'

import { cn } from '@/utils/cn'

export const StatCard = ({
  accent = false,
  label,
  onClick,
  selected = false,
  value,
}) => {
  const Component = onClick ? 'button' : 'div'
  const isAccent = accent && !selected

  return createElement(
    Component,
    {
      className: cn(
        'surface-card relative w-full overflow-hidden p-6 text-left',
        isAccent ? '!border-transparent !bg-[rgba(47,93,115,0.92)] !text-white' : '!bg-white/90',
        selected
          ? '!border-[rgba(47,93,115,0.42)] !bg-[linear-gradient(180deg,rgba(47,93,115,0.16),rgba(47,93,115,0.08))] shadow-[0_22px_60px_rgba(47,93,115,0.16)] ring-2 ring-[rgba(47,93,115,0.18)]'
          : '',
        onClick
          ? 'cursor-pointer transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(47,93,115,0.16)]'
          : '',
      ),
      onClick,
      type: onClick ? 'button' : undefined,
    },
    <>
      {selected ? (
        <span className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-[var(--color-primary)]" />
      ) : null}
      <p
        className={cn(
          'text-sm uppercase tracking-[0.22em]',
          isAccent ? 'text-white/70' : 'text-[var(--color-primary)]',
          selected ? 'text-[rgba(47,93,115,0.82)]' : '',
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          'mt-4 text-4xl font-bold',
          isAccent ? 'text-white' : 'text-[var(--color-text)]',
          selected ? 'text-[var(--color-primary)]' : '',
        )}
      >
        {value}
      </p>
    </>,
  )
}

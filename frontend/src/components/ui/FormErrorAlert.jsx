import { cn } from '@/utils/cn'

export const FormErrorAlert = ({ children, className }) => (
  <div
    className={cn(
      'rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]',
      className,
    )}
  >
    {children}
  </div>
)

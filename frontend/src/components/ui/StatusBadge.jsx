import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiClock, FiInfo } from 'react-icons/fi'

import { cn } from '@/utils/cn'

const toneConfig = {
  success: { className: 'status-badge--success', icon: FiCheckCircle },
  warning: { className: 'status-badge--warning', icon: FiAlertTriangle },
  danger: { className: 'status-badge--danger', icon: FiAlertCircle },
  info: { className: 'status-badge--info', icon: FiInfo },
  neutral: { className: 'status-badge--neutral', icon: FiClock },
}

export const StatusBadge = ({
  children,
  className,
  icon: CustomIcon,
  tone = 'neutral',
}) => {
  const config = toneConfig[tone] ?? toneConfig.neutral
  const Icon = CustomIcon ?? config.icon

  return (
    <span className={cn('status-badge', config.className, className)}>
      {Icon ? <Icon aria-hidden="true" className="size-3.5" /> : null}
      <span>{children}</span>
    </span>
  )
}

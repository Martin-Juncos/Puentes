import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi'

import { cn } from '@/utils/cn'

const toneConfig = {
  error: { className: 'alert--error', icon: FiAlertCircle },
  success: { className: 'alert--success', icon: FiCheckCircle },
  info: { className: 'alert--info', icon: FiInfo },
  warning: { className: 'alert--warning', icon: FiAlertTriangle },
}

export const Alert = ({
  children,
  className,
  icon: CustomIcon,
  title,
  tone = 'info',
}) => {
  const config = toneConfig[tone] ?? toneConfig.info
  const Icon = CustomIcon ?? config.icon

  return (
    <div className={cn('alert', config.className, className)} role={tone === 'error' ? 'alert' : 'status'}>
      <div className="alert__header">
        {Icon ? <Icon aria-hidden="true" className="alert__icon size-4" /> : null}
        <div className="min-w-0">
          {title ? <p className="alert__title">{title}</p> : null}
          <div className="alert__body">{children}</div>
        </div>
      </div>
    </div>
  )
}

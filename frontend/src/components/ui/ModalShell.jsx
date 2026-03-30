import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiX } from 'react-icons/fi'

import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/utils/cn'

const MotionDiv = motion.div

export const ModalShell = ({
  children,
  className,
  closeLabel = 'Cerrar modal',
  isDismissible = true,
  isOpen,
  maxWidthClassName = 'max-w-xl',
  onClose,
  panelClassName,
}) => {
  useEffect(() => {
    if (!isOpen || !isDismissible) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDismissible, isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          animate={{ opacity: 1 }}
          className="modal-overlay"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={isDismissible ? onClose : undefined}
        >
          <MotionDiv
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn('modal-shell', maxWidthClassName, className)}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className={cn('modal-panel surface-card p-7 sm:p-8', panelClassName)}>
              {isDismissible ? (
                <IconButton
                  aria-label={closeLabel}
                  className="modal-close-button"
                  onClick={onClose}
                  variant="outline"
                >
                  <FiX aria-hidden="true" className="size-4" />
                </IconButton>
              ) : null}
              {children}
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  )
}

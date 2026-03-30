import { FiCheckCircle } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { ModalShell } from '@/components/ui/ModalShell'

export const SuccessFeedbackModal = ({
  actionLabel = 'Entendido',
  description,
  isOpen,
  onClose,
  title,
}) => (
  <ModalShell
    closeLabel="Cerrar confirmación de creación"
    isDismissible
    isOpen={isOpen}
    maxWidthClassName="max-w-lg"
    onClose={onClose}
  >
    <div className="flex items-start gap-4 pr-10">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(167,196,181,0.2)] text-[var(--color-success-text)]">
        <FiCheckCircle aria-hidden="true" className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="eyebrow-label">Operación completada</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>

    <div className="mt-6 flex justify-end">
      <Button autoFocus onClick={onClose} type="button">
        {actionLabel}
      </Button>
    </div>
  </ModalShell>
)

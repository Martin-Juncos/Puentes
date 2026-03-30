import { useMemo, useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { ModalShell } from '@/components/ui/ModalShell'
import { StatusBadge } from '@/components/ui/StatusBadge'

const REQUIRED_CONFIRMATION = 'ELIMINAR'

export const ConfirmDeleteModal = ({
  isOpen,
  title,
  description,
  subjectName,
  subjectMeta,
  error,
  errorDetails,
  statusNotice,
  resolutionActions = [],
  isDeleting = false,
  onClose,
  onConfirm,
}) => {
  const [confirmationText, setConfirmationText] = useState('')

  const isConfirmationValid = useMemo(
    () => confirmationText === REQUIRED_CONFIRMATION,
    [confirmationText],
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isConfirmationValid || isDeleting) {
      return
    }

    onConfirm()
  }

  return (
    <ModalShell
      closeLabel="Cerrar confirmación de eliminación"
      isDismissible={!isDeleting}
      isOpen={isOpen}
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
    >
      <div className="flex items-start gap-4 pr-10">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(217,140,122,0.16)] text-[#8b4b3d]">
          <FiAlertTriangle aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="eyebrow-label">Confirmación requerida</p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border-soft)] bg-white/80 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-[var(--color-primary)]">{subjectName}</p>
          <StatusBadge tone="warning">Eliminación permanente</StatusBadge>
        </div>
        {subjectMeta ? <p className="mt-1 text-sm text-[var(--color-text-soft)]">{subjectMeta}</p> : null}
        <p className="mt-3 text-sm text-[var(--color-text-soft)]">
          Escribí <span className="font-semibold tracking-[0.18em] text-[#8b4b3d]">{REQUIRED_CONFIRMATION}</span> para habilitar la confirmación.
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Field
          hint="La palabra debe coincidir exactamente para evitar eliminaciones accidentales."
          label="Confirmación manual"
          required
        >
          <input
            autoFocus
            className="field-input"
            onChange={(event) => setConfirmationText(event.target.value)}
            placeholder={`Escribir ${REQUIRED_CONFIRMATION}`}
            spellCheck="false"
            value={confirmationText}
          />
        </Field>

        {statusNotice ? (
          <Alert title={statusNotice.title} tone="info">
            <p>{statusNotice.description}</p>
          </Alert>
        ) : null}

        {error ? (
          <Alert title="No pudimos completar la eliminación" tone="error">
            <p>{error}</p>
            {errorDetails?.blockers?.length ? (
              <div className="mt-3 space-y-3">
                {errorDetails.blockers.map((blocker) => (
                  <div key={blocker.key} className="rounded-xl bg-white/55 px-4 py-3">
                    <p className="font-semibold text-[#8b4b3d]">
                      {blocker.label}: {blocker.count}
                    </p>
                    {blocker.items?.length ? (
                      <p className="mt-1 text-[rgba(139,75,61,0.9)]">
                        {blocker.items.join(', ')}
                        {blocker.count > blocker.items.length ? ` y ${blocker.count - blocker.items.length} más` : ''}
                      </p>
                    ) : null}
                    {blocker.solution ? (
                      <p className="mt-1 text-[rgba(139,75,61,0.9)]">Cómo resolverlo: {blocker.solution}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {errorDetails?.nextSteps?.length ? (
              <div className="mt-3 rounded-xl bg-white/55 px-4 py-3">
                <p className="font-semibold text-[#8b4b3d]">Sugerencias</p>
                <div className="mt-2 space-y-1 text-[rgba(139,75,61,0.9)]">
                  {errorDetails.nextSteps.map((step) => (
                    <p key={step}>{step}</p>
                  ))}
                </div>
              </div>
            ) : null}
            {resolutionActions.length ? (
              <div className="mt-3 rounded-xl bg-white/55 px-4 py-3">
                <p className="font-semibold text-[#8b4b3d]">Resolver desde acá</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {resolutionActions.map((action) => (
                    <Button
                      key={action.key}
                      className={action.className}
                      disabled={action.disabled || isDeleting}
                      onClick={action.onClick}
                      type="button"
                      variant={action.variant ?? 'outline'}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </Alert>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button disabled={isDeleting} onClick={onClose} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!isConfirmationValid || isDeleting} type="submit" variant="destructive">
            {isDeleting ? 'Eliminando...' : 'Confirmar eliminación'}
          </Button>
        </div>
      </form>
    </ModalShell>
  )
}

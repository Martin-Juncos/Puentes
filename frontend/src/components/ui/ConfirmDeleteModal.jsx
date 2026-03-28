import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'

const MotionDiv = motion.div
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

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isDeleting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDeleting, isOpen, onClose])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isConfirmationValid || isDeleting) {
      return
    }

    onConfirm()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,39,45,0.48)] px-4 py-8 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionDiv
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl"
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            onClick={(event) => event.stopPropagation()}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <PanelCard className="relative rounded-[2rem] bg-[rgba(247,244,238,0.98)] p-7 shadow-[0_24px_80px_rgba(47,93,115,0.18)]">
              <button
                aria-label="Cerrar confirmación de eliminación"
                className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-[rgba(47,93,115,0.12)] bg-white text-[var(--color-primary)] transition-colors hover:bg-[rgba(47,93,115,0.05)]"
                onClick={onClose}
                type="button"
              >
                <FiX aria-hidden="true" className="size-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(217,140,122,0.16)] text-[#8b4b3d]">
                  <FiAlertTriangle aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-[rgba(47,93,115,0.58)]">Confirmación requerida</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[rgba(46,46,46,0.72)]">{description}</p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[rgba(47,93,115,0.1)] bg-white/80 px-5 py-4">
                <p className="text-sm font-semibold text-[var(--color-primary)]">{subjectName}</p>
                {subjectMeta ? <p className="mt-1 text-sm text-[rgba(46,46,46,0.66)]">{subjectMeta}</p> : null}
                <p className="mt-3 text-sm text-[rgba(46,46,46,0.66)]">
                  Escribí <span className="font-semibold tracking-[0.18em] text-[#8b4b3d]">{REQUIRED_CONFIRMATION}</span> para habilitar la confirmación.
                </p>
              </div>

              <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                <Field
                  hint="La palabra debe coincidir exactamente para evitar eliminaciones accidentales."
                  label="Confirmación manual"
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
                  <div className="rounded-2xl border border-[rgba(47,93,115,0.14)] bg-[rgba(167,196,181,0.16)] px-4 py-4 text-sm text-[var(--color-primary)]">
                    <p className="font-semibold">{statusNotice.title}</p>
                    <p className="mt-1 text-[rgba(47,93,115,0.84)]">{statusNotice.description}</p>
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-4 text-sm text-[#8b4b3d]">
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
                  </div>
                ) : null}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button onClick={onClose} type="button" variant="ghost">
                    Cancelar
                  </Button>
                  <Button
                    className="bg-[#b75f50] text-white hover:bg-[#9f4f43] disabled:hover:bg-[#b75f50]"
                    disabled={!isConfirmationValid || isDeleting}
                    type="submit"
                  >
                    {isDeleting ? 'Eliminando...' : 'Confirmar eliminación'}
                  </Button>
                </div>
              </form>
            </PanelCard>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  )
}

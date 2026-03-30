import { useState } from 'react'

import { PageHeader } from '@/components/private/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { FormErrorAlert } from '@/components/ui/FormErrorAlert'
import { PanelCard } from '@/components/ui/PanelCard'
import { SuccessFeedbackModal } from '@/components/ui/SuccessFeedbackModal'
import { RoleCalendar } from '@/features/calendar/RoleCalendar'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'
import { sessionsService } from '@/services/sessionsService'
import { formatDateTime } from '@/utils/formatters'

const initialForm = {
  childId: '',
  professionalId: '',
  serviceId: '',
  startsAt: '',
  adminNotes: '',
}

export const AgendaPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const { data: sessions, isLoading, reload } = useAsyncData(() => sessionsService.list(), [])
  const { data: children } = useAsyncData(() => childrenService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])
  const { data: services } = useAsyncData(() => servicesService.listManage(), [])

  const canManageAgenda = ['ADMIN', 'COORDINATION', 'SECRETARY'].includes(user.role)

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await sessionsService.create(form)
      setForm(initialForm)
      setError('')
      await reload()
      setIsSuccessModalOpen(true)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Secretaría, coordinación y profesionales trabajan sobre la misma base institucional, pero con permisos distintos para consulta y gestión."
        eyebrow="Agenda interna"
        title="Calendario operativo por roles"
      />

      <RoleCalendar sessions={sessions} />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <PanelCard variant="form">
          <h3 className="text-xl font-semibold text-[var(--color-primary)]">Próximas sesiones</h3>
          <div className="mt-5 grid gap-4">
            {sessions.slice(0, 6).length ? (
              sessions.slice(0, 6).map((session) => (
                <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] px-4 py-4" key={session.id}>
                  <p className="font-semibold text-[var(--color-primary)]">
                    {session.child.firstName} {session.child.lastName}
                  </p>
                  <p className="mt-1 text-sm text-[rgba(46,46,46,0.72)]">
                    {session.professional.user.fullName} · {session.service.name}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">
                    {formatDateTime(session.startsAt)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                description="Cuando haya sesiones próximas cargadas en la agenda, se van a listar acá."
                title="No hay sesiones próximas"
              />
            )}
          </div>
        </PanelCard>

        <PanelCard className={canManageAgenda ? '' : 'bg-[rgba(47,93,115,0.04)]'} variant={canManageAgenda ? 'form' : 'muted'}>
          <h3 className="text-xl font-semibold text-[var(--color-primary)]">Crear nueva sesión</h3>
          {!canManageAgenda ? (
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Como profesional, en esta etapa podés consultar tu agenda y usar el módulo de seguimientos. La
              programación y reprogramación quedan a cargo de secretaría o coordinación.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <Field label="Niño o niña" required>
                <select className="field-input" onChange={updateField('childId')} required value={form.childId}>
                  <option value="">Seleccionar</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Profesional" required>
                <select className="field-input" onChange={updateField('professionalId')} required value={form.professionalId}>
                  <option value="">Seleccionar</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.user.fullName} · {professional.discipline}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Servicio" required>
                <select className="field-input" onChange={updateField('serviceId')} required value={form.serviceId}>
                  <option value="">Seleccionar</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field hint="La duración final se calcula según el servicio si no se indica un cierre manual." label="Inicio" required>
                <input className="field-input" onChange={updateField('startsAt')} required type="datetime-local" value={form.startsAt} />
              </Field>
              <Field label="Observaciones administrativas">
                <textarea className="field-input min-h-28" onChange={updateField('adminNotes')} value={form.adminNotes} />
              </Field>
              {error ? <FormErrorAlert>{error}</FormErrorAlert> : null}
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Guardando...' : 'Crear sesión'}
              </Button>
            </form>
          )}
        </PanelCard>
      </div>

      <SuccessFeedbackModal
        description="La sesión ya quedó agendada y visible en el calendario operativo."
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Sesión creada"
      />
    </div>
  )
}

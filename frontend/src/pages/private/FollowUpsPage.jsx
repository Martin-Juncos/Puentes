import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { followUpsService } from '@/services/followUpsService'
import { professionalsService } from '@/services/professionalsService'
import { sessionsService } from '@/services/sessionsService'
import { formatDateTime } from '@/utils/formatters'

const initialForm = {
  childId: '',
  sessionId: '',
  professionalId: '',
  title: '',
  note: '',
}

export const FollowUpsPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const { data: followUps, reload } = useAsyncData(() => followUpsService.list(), [])
  const { data: children } = useAsyncData(() => childrenService.list(), [])
  const { data: sessions } = useAsyncData(() => sessionsService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])

  const canChooseProfessional = ['ADMIN', 'COORDINATION'].includes(user.role)

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await followUpsService.create({
        ...form,
        professionalId: canChooseProfessional ? form.professionalId : undefined,
        sessionId: form.sessionId || undefined,
        title: form.title || undefined,
      })
      setForm(initialForm)
      setError('')
      reload()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Nuevo seguimiento</h2>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Niño o niña">
            <select className="field-input" onChange={updateField('childId')} required value={form.childId}>
              <option value="">Seleccionar</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sesión">
            <select className="field-input" onChange={updateField('sessionId')} value={form.sessionId}>
              <option value="">Opcional</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.child.firstName} {session.child.lastName} · {formatDateTime(session.startsAt)}
                </option>
              ))}
            </select>
          </Field>
          {canChooseProfessional ? (
            <Field label="Profesional responsable">
              <select className="field-input" onChange={updateField('professionalId')} required value={form.professionalId}>
                <option value="">Seleccionar</option>
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.user.fullName}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          <Field label="Título">
            <input className="field-input" onChange={updateField('title')} value={form.title} />
          </Field>
          <Field label="Nota de seguimiento">
            <textarea className="field-input min-h-36" onChange={updateField('note')} required value={form.note} />
          </Field>
          {error ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{error}</div> : null}
          <Button type="submit">Guardar seguimiento</Button>
        </form>
      </PanelCard>

      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Seguimientos cargados</h2>
        <div className="mt-6">
          <DataTable
            columns={[
              {
                key: 'child',
                label: 'Caso',
                render: (row) => `${row.child.firstName} ${row.child.lastName}`,
              },
              {
                key: 'professional',
                label: 'Profesional',
                render: (row) => row.professional.user.fullName,
              },
              {
                key: 'createdAt',
                label: 'Fecha',
                render: (row) => formatDateTime(row.createdAt),
              },
              { key: 'note', label: 'Nota' },
            ]}
            rows={followUps}
          />
        </div>
      </PanelCard>
    </div>
  )
}

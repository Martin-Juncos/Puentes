import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { professionalsService } from '@/services/professionalsService'
import { usersService } from '@/services/usersService'

const initialForm = {
  userId: '',
  discipline: '',
  bio: '',
  calendarColor: '#2F5D73',
  isHighlighted: true,
}

export const ProfessionalsPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const canManage = ['ADMIN', 'COORDINATION'].includes(user.role)

  const { data: professionals, reload } = useAsyncData(() => professionalsService.listManage(), [])
  const { data: users } = useAsyncData(() => (canManage ? usersService.list() : Promise.resolve([])), [canManage])
  const availableUsers = users.filter(
    (candidate) =>
      ['PROFESSIONAL', 'COORDINATION'].includes(candidate.role) &&
      !professionals.some((professional) => professional.user.id === candidate.id),
  )

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: field === 'isHighlighted' ? event.target.checked : event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await professionalsService.upsert(form)
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
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Equipo profesional</h2>
        <div className="mt-6">
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Nombre',
                render: (row) => row.user.fullName,
              },
              { key: 'discipline', label: 'Disciplina' },
              {
                key: 'role',
                label: 'Rol',
                render: (row) => row.user.role,
              },
              {
                key: 'highlighted',
                label: 'Visibilidad pública',
                render: (row) => (row.isHighlighted ? 'Destacado' : 'Solo interno'),
              },
            ]}
            rows={professionals}
          />
        </div>
      </PanelCard>

      <PanelCard className={!canManage ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Agregar perfil profesional</h2>
        {!canManage ? (
          <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.7)]">
            Este módulo se presenta también a secretaría para consulta, pero la carga de perfiles queda reservada a administración y coordinación.
          </p>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <Field label="Usuario">
              <select className="field-input" onChange={updateField('userId')} required value={form.userId}>
                <option value="">Seleccionar</option>
                {availableUsers.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.fullName} · {candidate.role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Disciplina">
              <input className="field-input" onChange={updateField('discipline')} required value={form.discipline} />
            </Field>
            <Field label="Bio">
              <textarea className="field-input min-h-28" onChange={updateField('bio')} value={form.bio} />
            </Field>
            <Field label="Color de agenda">
              <input className="field-input h-14" onChange={updateField('calendarColor')} type="color" value={form.calendarColor} />
            </Field>
            <label className="flex items-center gap-3 text-sm font-medium text-[var(--color-primary)]">
              <input checked={form.isHighlighted} onChange={updateField('isHighlighted')} type="checkbox" />
              Destacar en la página pública
            </label>
            {error ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{error}</div> : null}
            <Button type="submit">Guardar perfil</Button>
          </form>
        )}
      </PanelCard>
    </div>
  )
}

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { servicesService } from '@/services/servicesService'

const initialForm = {
  name: '',
  description: '',
  durationMinutes: 45,
  colorTag: '#2F5D73',
}

export const ServicesAdminPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const { data: services, reload } = useAsyncData(() => servicesService.listManage(), [])

  const canManage = ['ADMIN', 'COORDINATION'].includes(user.role)

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await servicesService.create({
        ...form,
        durationMinutes: Number(form.durationMinutes),
      })
      setForm(initialForm)
      setError('')
      reload()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Servicios disponibles</h2>
        <div className="mt-6">
          <DataTable
            columns={[
              { key: 'name', label: 'Servicio' },
              { key: 'description', label: 'Descripción' },
              {
                key: 'durationMinutes',
                label: 'Duración',
                render: (row) => `${row.durationMinutes} min`,
              },
              { key: 'status', label: 'Estado' },
            ]}
            rows={services}
          />
        </div>
      </PanelCard>

      <PanelCard className={!canManage ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Configurar servicio</h2>
        {!canManage ? (
          <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
            Esta sección queda visible para consulta operativa, pero la creación y edición de servicios corresponde a coordinación o administración.
          </p>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <Field label="Nombre">
              <input className="field-input" onChange={updateField('name')} required value={form.name} />
            </Field>
            <Field label="Descripción">
              <textarea className="field-input min-h-28" onChange={updateField('description')} required value={form.description} />
            </Field>
            <Field label="Duración en minutos">
              <input className="field-input" min="15" onChange={updateField('durationMinutes')} required type="number" value={form.durationMinutes} />
            </Field>
            <Field label="Color de referencia">
              <input className="field-input h-14" onChange={updateField('colorTag')} type="color" value={form.colorTag} />
            </Field>
            {error ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{error}</div> : null}
            <Button type="submit">Guardar servicio</Button>
          </form>
        )}
      </PanelCard>
    </div>
  )
}

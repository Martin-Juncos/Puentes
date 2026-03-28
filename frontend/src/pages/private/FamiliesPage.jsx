import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { familiesService } from '@/services/familiesService'

const initialForm = {
  displayName: '',
  primaryContactName: '',
  primaryContactRelationship: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
}

export const FamiliesPage = () => {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: families, reload } = useAsyncData(() => familiesService.list(), [])

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await familiesService.create(form)
      setForm(initialForm)
      setError('')
      reload()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Alta de familia</h2>
        <p className="mt-3 text-sm leading-7 text-[rgba(46,46,46,0.7)]">
          Secretaría organiza familias y tutores como base administrativa para el seguimiento de niños, agenda y cobros.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <Field label="Nombre de referencia">
            <input className="field-input" onChange={updateField('displayName')} required value={form.displayName} />
          </Field>
          <Field label="Contacto principal">
            <input
              className="field-input"
              onChange={updateField('primaryContactName')}
              required
              value={form.primaryContactName}
            />
          </Field>
          <Field label="Relación">
            <input
              className="field-input"
              onChange={updateField('primaryContactRelationship')}
              required
              value={form.primaryContactRelationship}
            />
          </Field>
          <Field label="Teléfono">
            <input className="field-input" onChange={updateField('phone')} required value={form.phone} />
          </Field>
          <Field label="Email">
            <input className="field-input" onChange={updateField('email')} type="email" value={form.email} />
          </Field>
          <Field label="Dirección">
            <input className="field-input" onChange={updateField('address')} value={form.address} />
          </Field>
          <Field label="Notas">
            <textarea className="field-input min-h-24" onChange={updateField('notes')} value={form.notes} />
          </Field>
          {error ? (
            <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
              {error}
            </div>
          ) : null}
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Guardando...' : 'Guardar familia'}
          </Button>
        </form>
      </PanelCard>

      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Familias registradas</h2>
        <div className="mt-6">
          <DataTable
            columns={[
              { key: 'displayName', label: 'Familia' },
              { key: 'primaryContactName', label: 'Contacto principal' },
              { key: 'phone', label: 'Teléfono' },
              { key: 'status', label: 'Estado' },
              {
                key: 'children',
                label: 'Niños',
                render: (row) => row.children.map((child) => `${child.firstName} ${child.lastName}`).join(', ') || 'Sin registros',
              },
            ]}
            rows={families}
          />
        </div>
      </PanelCard>
    </div>
  )
}

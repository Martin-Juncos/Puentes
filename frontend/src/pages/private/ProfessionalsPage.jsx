import { useMemo, useState } from 'react'
import { FiEdit2, FiUserCheck } from 'react-icons/fi'

import { PageHeader } from '@/components/private/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field } from '@/components/ui/Field'
import { FormErrorAlert } from '@/components/ui/FormErrorAlert'
import { PanelCard } from '@/components/ui/PanelCard'
import { SuccessFeedbackModal } from '@/components/ui/SuccessFeedbackModal'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { professionalsService } from '@/services/professionalsService'

const initialForm = {
  userId: '',
  discipline: '',
  bio: '',
  calendarColor: '#2F5D73',
  isHighlighted: true,
}

const buildFormFromProfessional = (professional) => ({
  userId: professional.user.id,
  discipline: professional.discipline ?? '',
  bio: professional.bio ?? '',
  calendarColor: professional.calendarColor ?? '#2F5D73',
  isHighlighted: Boolean(professional.isHighlighted),
})

export const ProfessionalsPage = () => {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const canManage = ['ADMIN', 'COORDINATION'].includes(user.role)

  const { data: professionals, reload } = useAsyncData(() => professionalsService.listManage(), [])

  const selectedProfessional = useMemo(
    () => professionals.find((professional) => professional.user.id === form.userId) ?? null,
    [form.userId, professionals],
  )

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: field === 'isHighlighted' ? event.target.checked : event.target.value,
    }))

  const selectProfessional = (professional) => {
    setForm(buildFormFromProfessional(professional))
    setError('')
  }

  const handleSelectionChange = (event) => {
    const nextProfessional = professionals.find((professional) => professional.user.id === event.target.value)

    if (!nextProfessional) {
      setForm(initialForm)
      setError('')
      return
    }

    selectProfessional(nextProfessional)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.userId) {
      return
    }

    try {
      const updatedProfile = await professionalsService.upsert(form)
      setForm(buildFormFromProfessional(updatedProfile))
      setError('')
      await reload()
      setIsSuccessModalOpen(true)
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Completá o ajustá el perfil profesional de usuarios existentes para mantener visible una presentación institucional consistente."
        eyebrow="Equipo profesional"
        title="Perfiles del equipo"
        meta={selectedProfessional ? <Badge variant="neutral">Editando: {selectedProfessional.user.fullName}</Badge> : null}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard variant="form">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Equipo profesional</h2>
              <p className="mt-2 text-sm leading-7 text-[rgba(46,46,46,0.68)]">
                Seleccioná un perfil desde la tabla para editar su presentación, color de agenda y visibilidad pública.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Nombre',
                  render: (row) => (
                    <div>
                      <p className="font-semibold text-[var(--color-primary)]">{row.user.fullName}</p>
                      <p className="mt-1 text-xs text-[rgba(46,46,46,0.62)]">{ROLE_LABELS[row.user.role] ?? row.user.role}</p>
                    </div>
                  ),
                },
                { key: 'discipline', label: 'Disciplina' },
                {
                  key: 'visibility',
                  label: 'Visibilidad pública',
                  render: (row) => (row.isHighlighted ? 'Destacado' : 'Solo interno'),
                },
                {
                  key: 'action',
                  label: 'Acción',
                  render: (row) => (
                    <Button className="px-3 py-2 text-xs" onClick={() => selectProfessional(row)} size="sm" type="button" variant="outline">
                      {form.userId === row.user.id ? 'Seleccionado' : 'Editar'}
                    </Button>
                  ),
                },
              ]}
              getRowClassName={(row) =>
                form.userId === row.user.id ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]' : ''
              }
              onRowClick={selectProfessional}
              rows={professionals}
            />
          </div>
        </PanelCard>

        <PanelCard className={!canManage ? 'bg-[rgba(47,93,115,0.04)]' : ''} variant={canManage ? 'form' : 'muted'}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
              <FiEdit2 aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Editar perfil profesional</h2>
              <p className="mt-2 text-sm leading-7 text-[rgba(46,46,46,0.68)]">
                Acá no se crean usuarios: se completa o ajusta el perfil profesional de alguien ya existente.
              </p>
            </div>
          </div>

          {!canManage ? (
            <p className="mt-6 text-sm leading-7 text-[rgba(46,46,46,0.7)]">
              Este módulo se presenta también a secretaría para consulta, pero la edición de perfiles queda reservada a
              administración y coordinación.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <Field hint="También podés hacer clic directamente sobre una fila del listado." label="Profesional">
                <select className="field-input" onChange={handleSelectionChange} value={form.userId}>
                  <option value="">Seleccionar perfil existente</option>
                  {professionals.map((professional) => (
                    <option key={professional.user.id} value={professional.user.id}>
                      {professional.user.fullName} · {professional.discipline}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedProfessional ? (
                <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[rgba(46,46,46,0.74)]">
                  <p className="font-semibold text-[var(--color-primary)]">{selectedProfessional.user.fullName}</p>
                  <p className="mt-1">Rol interno: {ROLE_LABELS[selectedProfessional.user.role] ?? selectedProfessional.user.role}</p>
                  <p className="mt-1">Email: {selectedProfessional.user.email}</p>
                </div>
              ) : (
                <EmptyState
                  description="Seleccioná un perfil del equipo para habilitar la edición."
                  icon={FiUserCheck}
                  title="Todavía no elegiste un profesional"
                />
              )}

              {selectedProfessional ? (
                <>
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
                </>
              ) : null}

              {error ? <FormErrorAlert>{error}</FormErrorAlert> : null}

              {selectedProfessional ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button type="submit">Guardar perfil</Button>
                  <Button
                    className="px-4 py-3"
                    onClick={() => {
                      setForm(initialForm)
                      setError('')
                    }}
                    type="button"
                    variant="ghost"
                  >
                    Limpiar selección
                  </Button>
                </div>
              ) : null}
            </form>
          )}

          {canManage && professionals.length === 0 ? (
            <EmptyState
              className="mt-6"
              description="Creá primero usuarios y luego completá sus perfiles profesionales desde este módulo."
              icon={FiUserCheck}
              title="No hay perfiles profesionales para editar"
            />
          ) : null}
        </PanelCard>
      </div>

      <SuccessFeedbackModal
        description="El perfil profesional quedó actualizado con su disciplina y configuración pública."
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Perfil profesional guardado"
      />
    </div>
  )
}

import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { familiesService } from '@/services/familiesService'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'
import { formatDate } from '@/utils/formatters'

const childInitialState = {
  firstName: '',
  lastName: '',
  birthDate: '',
  familyId: '',
  schoolName: '',
  notes: '',
}

const assignmentInitialState = {
  childId: '',
  professionalId: '',
  serviceId: '',
  notes: '',
}

export const ChildrenPage = () => {
  const { user } = useAuth()
  const [childForm, setChildForm] = useState(childInitialState)
  const [assignmentForm, setAssignmentForm] = useState(assignmentInitialState)
  const [childError, setChildError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')

  const { data: children, reload } = useAsyncData(() => childrenService.list(), [])
  const { data: families } = useAsyncData(() => familiesService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])
  const { data: services } = useAsyncData(() => servicesService.listManage(), [])
  const canManageChildren = ['ADMIN', 'COORDINATION', 'SECRETARY'].includes(user.role)

  const updateChildField = (field) => (event) =>
    setChildForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const updateAssignmentField = (field) => (event) =>
    setAssignmentForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleChildSubmit = async (event) => {
    event.preventDefault()

    try {
      await childrenService.create(childForm)
      setChildForm(childInitialState)
      setChildError('')
      reload()
    } catch (error) {
      setChildError(error.message)
    }
  }

  const handleAssignmentSubmit = async (event) => {
    event.preventDefault()

    try {
      await childrenService.assignProfessional(assignmentForm.childId, {
        professionalId: assignmentForm.professionalId,
        serviceId: assignmentForm.serviceId || undefined,
        notes: assignmentForm.notes,
      })
      setAssignmentForm(assignmentInitialState)
      setAssignmentError('')
      reload()
    } catch (error) {
      setAssignmentError(error.message)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Alta de niño o niña</h2>
          {!canManageChildren ? (
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Como profesional, esta vista queda orientada a consulta de casos asignados. Las altas y nuevas asignaciones corresponden a secretaría o coordinación.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleChildSubmit}>
              <Field label="Nombre">
                <input className="field-input" onChange={updateChildField('firstName')} required value={childForm.firstName} />
              </Field>
              <Field label="Apellido">
                <input className="field-input" onChange={updateChildField('lastName')} required value={childForm.lastName} />
              </Field>
              <Field label="Fecha de nacimiento">
                <input className="field-input" onChange={updateChildField('birthDate')} required type="date" value={childForm.birthDate} />
              </Field>
              <Field label="Familia asociada">
                <select className="field-input" onChange={updateChildField('familyId')} required value={childForm.familyId}>
                  <option value="">Seleccionar</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.displayName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Escuela">
                <input className="field-input" onChange={updateChildField('schoolName')} value={childForm.schoolName} />
              </Field>
              <Field label="Observaciones básicas">
                <textarea className="field-input min-h-24" onChange={updateChildField('notes')} value={childForm.notes} />
              </Field>
              {childError ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{childError}</div> : null}
              <Button type="submit">Guardar niño</Button>
            </form>
          )}
        </PanelCard>

        <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Asignar profesional</h2>
          {!canManageChildren ? (
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Las asignaciones se definen desde secretaría o coordinación para sostener una agenda centralizada y consistente.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleAssignmentSubmit}>
              <Field label="Caso">
                <select className="field-input" onChange={updateAssignmentField('childId')} required value={assignmentForm.childId}>
                  <option value="">Seleccionar</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Profesional">
                <select className="field-input" onChange={updateAssignmentField('professionalId')} required value={assignmentForm.professionalId}>
                  <option value="">Seleccionar</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.user.fullName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Servicio">
                <select className="field-input" onChange={updateAssignmentField('serviceId')} value={assignmentForm.serviceId}>
                  <option value="">Opcional</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Notas de asignación">
                <textarea className="field-input min-h-24" onChange={updateAssignmentField('notes')} value={assignmentForm.notes} />
              </Field>
              {assignmentError ? (
                <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{assignmentError}</div>
              ) : null}
              <Button type="submit" variant="secondary">
                Asignar profesional
              </Button>
            </form>
          )}
        </PanelCard>
      </div>

      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Casos registrados</h2>
        <div className="mt-6">
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Niño / niña',
                render: (row) => `${row.firstName} ${row.lastName}`,
              },
              {
                key: 'family',
                label: 'Familia',
                render: (row) => row.family.displayName,
              },
              {
                key: 'birthDate',
                label: 'Nacimiento',
                render: (row) => formatDate(row.birthDate),
              },
              {
                key: 'assignments',
                label: 'Asignaciones',
                render: (row) =>
                  row.assignments
                    .map((assignment) =>
                      `${assignment.professional.user.fullName}${assignment.service ? ` · ${assignment.service.name}` : ''}`,
                    )
                    .join(', ') || 'Sin asignación',
              },
            ]}
            rows={children}
          />
        </div>
      </PanelCard>
    </div>
  )
}

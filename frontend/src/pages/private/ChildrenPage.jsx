import { useMemo, useState } from 'react'
import { FiClipboard, FiMessageSquare, FiTrash2, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
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

const childCreateInitial = {
  firstName: '',
  lastName: '',
  birthDate: '',
  familyId: '',
  schoolName: '',
  notes: '',
}

const childUpdateInitial = {
  id: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  familyId: '',
  schoolName: '',
  notes: '',
  status: 'ACTIVE',
}

const assignmentInitial = {
  childId: '',
  professionalId: '',
  serviceId: '',
  notes: '',
}

const buildChildUpdateForm = (child) => ({
  id: child.id,
  firstName: child.firstName ?? '',
  lastName: child.lastName ?? '',
  birthDate: child.birthDate ? new Date(child.birthDate).toISOString().slice(0, 10) : '',
  familyId: child.family?.id ?? '',
  schoolName: child.schoolName ?? '',
  notes: child.notes ?? '',
  status: child.status ?? 'ACTIVE',
})

const childStatusLabels = {
  ACTIVE: 'Activo',
  PAUSED: 'En pausa',
  DISCHARGED: 'Alta',
}

const childStatusClasses = {
  ACTIVE: 'bg-[rgba(167,196,181,0.2)] text-[#2f5d73]',
  PAUSED: 'bg-[rgba(221,211,195,0.36)] text-[#6d5948]',
  DISCHARGED: 'bg-[rgba(217,140,122,0.18)] text-[#8b4b3d]',
}

export const ChildrenPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [childCreateForm, setChildCreateForm] = useState(childCreateInitial)
  const [childUpdateForm, setChildUpdateForm] = useState(childUpdateInitial)
  const [assignmentForm, setAssignmentForm] = useState(assignmentInitial)
  const [childCreateError, setChildCreateError] = useState('')
  const [childUpdateError, setChildUpdateError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteErrorDetails, setDeleteErrorDetails] = useState(null)
  const [deleteStatusNotice, setDeleteStatusNotice] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [resolutionActionKey, setResolutionActionKey] = useState('')

  const { data: children, reload } = useAsyncData(() => childrenService.list(), [])
  const { data: families } = useAsyncData(() => familiesService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])
  const { data: services } = useAsyncData(() => servicesService.listManage(), [])

  const canManageChildren = ['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'].includes(user.role)
  const selectedChild = useMemo(
    () => children.find((child) => child.id === childUpdateForm.id) ?? null,
    [children, childUpdateForm.id],
  )

  const updateCreateField = (field) => (event) =>
    setChildCreateForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const updateChildField = (field) => (event) =>
    setChildUpdateForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const updateAssignmentField = (field) => (event) =>
    setAssignmentForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const selectChildForUpdate = (child) => {
    setChildUpdateForm(buildChildUpdateForm(child))
    setChildUpdateError('')
  }

  const openChildMessages = (childId) => {
    navigate(`/app/mensajes?childId=${childId}&compose=1`)
  }

  const handleChildSelection = (event) => {
    const nextChild = children.find((child) => child.id === event.target.value)

    if (!nextChild) {
      setChildUpdateForm(childUpdateInitial)
      setChildUpdateError('')
      return
    }

    selectChildForUpdate(nextChild)
  }

  const handleChildCreate = async (event) => {
    event.preventDefault()

    try {
      await childrenService.create(childCreateForm)
      setChildCreateForm(childCreateInitial)
      setChildCreateError('')
      await reload()
    } catch (error) {
      setChildCreateError(error.message)
    }
  }

  const handleChildUpdate = async (event) => {
    event.preventDefault()

    if (!childUpdateForm.id) {
      return
    }

    try {
      const updatedChild = await childrenService.update(childUpdateForm.id, {
        firstName: childUpdateForm.firstName,
        lastName: childUpdateForm.lastName,
        birthDate: childUpdateForm.birthDate,
        familyId: childUpdateForm.familyId,
        schoolName: childUpdateForm.schoolName,
        notes: childUpdateForm.notes,
        status: childUpdateForm.status,
      })

      setChildUpdateForm(buildChildUpdateForm(updatedChild))
      setChildUpdateError('')
      await reload()
    } catch (error) {
      setChildUpdateError(error.message)
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
      setAssignmentForm(assignmentInitial)
      setAssignmentError('')
      await reload()
    } catch (error) {
      setAssignmentError(error.message)
    }
  }

  const closeDeleteModal = () => {
    if (isDeleting) {
      return
    }

    setDeleteError('')
    setDeleteErrorDetails(null)
    setDeleteStatusNotice(null)
    setIsDeleteModalOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedChild) {
      return
    }

    try {
      setIsDeleting(true)
      await childrenService.remove(selectedChild.id)
      setChildUpdateForm(childUpdateInitial)
      setChildUpdateError('')
      setDeleteError('')
      setDeleteErrorDetails(null)
      setDeleteStatusNotice(null)
      setIsDeleteModalOpen(false)
      await reload()
    } catch (error) {
      setDeleteError(error.message)
      setDeleteErrorDetails(error.details ?? null)
      setDeleteStatusNotice(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClearAssignments = async () => {
    if (!selectedChild) {
      return
    }

    try {
      setResolutionActionKey('clear-assignments')
      const updatedChild = await childrenService.clearAssignments(selectedChild.id)
      setChildUpdateForm(buildChildUpdateForm(updatedChild))
      setChildUpdateError('')
      setDeleteStatusNotice(null)
      setDeleteErrorDetails((currentDetails) => {
        const remainingBlockers = currentDetails?.blockers?.filter((blocker) => blocker.key !== 'assignments') ?? []

        if (!remainingBlockers.length) {
          setDeleteError('')
          setDeleteStatusNotice({
            title: 'Listo para eliminar',
            description: 'Las asignaciones se quitaron correctamente. Si no quedan otras relaciones pendientes, ya podés confirmar la eliminación.',
          })
          return null
        }

        setDeleteError('Todavía hay relaciones que impiden eliminar el caso.')
        return {
          ...currentDetails,
          blockers: remainingBlockers,
        }
      })
      await reload()
    } catch (error) {
      setDeleteError(error.message)
      setDeleteErrorDetails(error.details ?? null)
      setDeleteStatusNotice(null)
    } finally {
      setResolutionActionKey('')
    }
  }

  const handleResolveWithStatus = async (status) => {
    if (!selectedChild) {
      return
    }

    try {
      setResolutionActionKey(`status-${status}`)
      const updatedChild = await childrenService.update(selectedChild.id, { status })
      setChildUpdateForm(buildChildUpdateForm(updatedChild))
      setChildUpdateError('')
      setDeleteError('')
      setDeleteErrorDetails(null)
      setDeleteStatusNotice(null)
      setIsDeleteModalOpen(false)
      await reload()
    } catch (error) {
      setDeleteError(error.message)
      setDeleteErrorDetails(error.details ?? null)
      setDeleteStatusNotice(null)
    } finally {
      setResolutionActionKey('')
    }
  }

  const deleteResolutionActions = []

  if (deleteErrorDetails) {
      if (deleteErrorDetails.blockers?.some((blocker) => blocker.key === 'assignments')) {
        deleteResolutionActions.push({
          key: 'clear-assignments',
          label: resolutionActionKey === 'clear-assignments' ? 'Quitando asignaciones...' : 'Quitar asignaciones',
          onClick: handleClearAssignments,
        disabled: Boolean(resolutionActionKey),
      })
    }

    deleteResolutionActions.push(
      {
        key: 'status-paused',
        label: resolutionActionKey === 'status-PAUSED' ? 'Marcando en pausa...' : 'Marcar en pausa',
        onClick: () => handleResolveWithStatus('PAUSED'),
        disabled: Boolean(resolutionActionKey),
      },
      {
        key: 'status-discharged',
        label: resolutionActionKey === 'status-DISCHARGED' ? 'Marcando alta...' : 'Marcar alta',
        onClick: () => handleResolveWithStatus('DISCHARGED'),
        disabled: Boolean(resolutionActionKey),
      },
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
              <FiClipboard aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Alta de niño o niña</h2>
              <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                Registro inicial del caso con familia asociada y datos básicos.
              </p>
            </div>
          </div>

          {!canManageChildren ? (
            <p className="mt-6 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Como profesional, esta vista queda orientada a consulta de casos asignados. Las altas, ediciones y bajas
              corresponden a secretaría o coordinación.
            </p>
          ) : (
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleChildCreate}>
              <Field label="Nombre">
                <input className="field-input" onChange={updateCreateField('firstName')} required value={childCreateForm.firstName} />
              </Field>
              <Field label="Apellido">
                <input className="field-input" onChange={updateCreateField('lastName')} required value={childCreateForm.lastName} />
              </Field>
              <Field label="Fecha de nacimiento">
                <input className="field-input" onChange={updateCreateField('birthDate')} required type="date" value={childCreateForm.birthDate} />
              </Field>
              <Field label="Familia asociada">
                <select className="field-input" onChange={updateCreateField('familyId')} required value={childCreateForm.familyId}>
                  <option value="">Seleccionar familia</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.displayName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Escuela">
                <input className="field-input" onChange={updateCreateField('schoolName')} value={childCreateForm.schoolName} />
              </Field>
              <Field label="Observaciones básicas">
                <textarea className="field-input min-h-24" onChange={updateCreateField('notes')} value={childCreateForm.notes} />
              </Field>
              {childCreateError ? (
                <div className="md:col-span-2 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
                  {childCreateError}
                </div>
              ) : null}
              <div className="md:col-span-2">
                <Button type="submit">Guardar niño</Button>
              </div>
            </form>
          )}
        </PanelCard>

        <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Actualizar o eliminar</h2>
              <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                Seleccioná un caso para cargar sus datos en edición.
              </p>
            </div>
            {selectedChild && canManageChildren ? (
              <Button
                className="px-4 py-2"
                onClick={() => {
                  setChildUpdateForm(childUpdateInitial)
                  setChildUpdateError('')
                }}
                type="button"
                variant="ghost"
              >
                Limpiar selección
              </Button>
            ) : null}
          </div>

          {!canManageChildren ? (
            <p className="mt-6 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              La edición y la baja de casos solo están disponibles para secretaría, coordinación y administración.
            </p>
          ) : (
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleChildUpdate}>
              <Field hint="También podés hacer clic sobre una fila del listado inferior." label="Caso seleccionado">
                <select className="field-input" onChange={handleChildSelection} value={childUpdateForm.id}>
                  <option value="">Seleccionar caso</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedChild ? (
                <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[rgba(46,46,46,0.74)]">
                  <p className="font-semibold text-[var(--color-primary)]">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </p>
                  <p className="mt-1">Familia: {selectedChild.family.displayName}</p>
                  <p className="mt-1">Asignaciones: {selectedChild.assignments.length}</p>
                  <Button
                    className="mt-3 gap-2 px-3 py-2 text-xs"
                    onClick={() => openChildMessages(selectedChild.id)}
                    type="button"
                    variant="outline"
                  >
                    <FiMessageSquare aria-hidden="true" className="size-4" />
                    Abrir mensajes
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-3 text-sm text-[rgba(46,46,46,0.64)]">
                  Seleccioná un caso para habilitar la edición.
                </div>
              )}

              {selectedChild ? (
                <>
                  <Field label="Nombre">
                    <input className="field-input" onChange={updateChildField('firstName')} required value={childUpdateForm.firstName} />
                  </Field>
                  <Field label="Apellido">
                    <input className="field-input" onChange={updateChildField('lastName')} required value={childUpdateForm.lastName} />
                  </Field>
                  <Field label="Fecha de nacimiento">
                    <input className="field-input" onChange={updateChildField('birthDate')} required type="date" value={childUpdateForm.birthDate} />
                  </Field>
                  <Field label="Familia asociada">
                    <select className="field-input" onChange={updateChildField('familyId')} required value={childUpdateForm.familyId}>
                      <option value="">Seleccionar familia</option>
                      {families.map((family) => (
                        <option key={family.id} value={family.id}>
                          {family.displayName}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Escuela">
                    <input className="field-input" onChange={updateChildField('schoolName')} value={childUpdateForm.schoolName} />
                  </Field>
                  <Field label="Estado">
                    <select className="field-input" onChange={updateChildField('status')} value={childUpdateForm.status}>
                      <option value="ACTIVE">Activo</option>
                      <option value="PAUSED">En pausa</option>
                      <option value="DISCHARGED">Alta</option>
                    </select>
                  </Field>
                  <Field label="Observaciones básicas">
                    <textarea className="field-input min-h-24" onChange={updateChildField('notes')} value={childUpdateForm.notes} />
                  </Field>
                </>
              ) : null}

              {childUpdateError ? (
                <div className="md:col-span-2 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
                  {childUpdateError}
                </div>
              ) : null}

              {selectedChild ? (
                <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button type="submit" variant="secondary">
                    Guardar cambios
                  </Button>
                  <Button
                    className="px-4 py-3 text-[#8b4b3d] hover:bg-[rgba(217,140,122,0.12)]"
                    onClick={() => {
                      setDeleteError('')
                      setDeleteErrorDetails(null)
                      setDeleteStatusNotice(null)
                      setIsDeleteModalOpen(true)
                    }}
                    type="button"
                    variant="ghost"
                  >
                    <FiTrash2 aria-hidden="true" className="mr-2 size-4" />
                    Eliminar caso
                  </Button>
                </div>
              ) : null}
            </form>
          )}
        </PanelCard>
      </div>

      <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
            <FiUserPlus aria-hidden="true" className="size-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Asignar profesional</h2>
            <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
              Las asignaciones se definen desde secretaría o coordinación para sostener una agenda centralizada.
            </p>
          </div>
        </div>

        {!canManageChildren ? (
          <p className="mt-6 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
            Esta sección queda visible para consulta, pero las asignaciones nuevas no están habilitadas para perfiles profesionales.
          </p>
        ) : (
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleAssignmentSubmit}>
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
              <div className="md:col-span-2 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
                {assignmentError}
              </div>
            ) : null}
            <div className="md:col-span-2">
              <Button type="submit" variant="secondary">
                Asignar profesional
              </Button>
            </div>
          </form>
        )}
      </PanelCard>

      <PanelCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Casos registrados</h2>
            <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
              Hacé clic sobre una fila para cargar el caso en actualización.
            </p>
          </div>
          <div className="rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {children.length} casos
          </div>
        </div>

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
                key: 'status',
                label: 'Estado',
                render: (row) => (
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${childStatusClasses[row.status]}`}>
                    {childStatusLabels[row.status] ?? row.status}
                  </span>
                ),
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
              {
                key: 'action',
                label: 'Acción',
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="px-3 py-2 text-xs"
                      onClick={() => selectChildForUpdate(row)}
                      type="button"
                      variant="outline"
                    >
                      {childUpdateForm.id === row.id ? 'Seleccionado' : 'Editar'}
                    </Button>
                    <Button
                      className="gap-1 px-3 py-2 text-xs"
                      onClick={(event) => {
                        event.stopPropagation()
                        openChildMessages(row.id)
                      }}
                      type="button"
                      variant="ghost"
                    >
                      <FiMessageSquare aria-hidden="true" className="size-4" />
                      Mensajes
                    </Button>
                  </div>
                ),
              },
            ]}
            getRowClassName={(row) =>
              childUpdateForm.id === row.id ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]' : ''
            }
            onRowClick={selectChildForUpdate}
            rows={children}
          />
        </div>
      </PanelCard>

      <ConfirmDeleteModal
        key={`${selectedChild?.id ?? 'empty'}-${isDeleteModalOpen ? 'open' : 'closed'}`}
        description={`Vas a eliminar el caso de ${selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''}. Si tiene asignaciones, sesiones, pagos o seguimientos, el sistema bloqueará la acción.`}
        error={deleteError}
        errorDetails={deleteErrorDetails}
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen && Boolean(selectedChild)}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        resolutionActions={deleteResolutionActions}
        statusNotice={deleteStatusNotice}
        subjectMeta={selectedChild ? `${selectedChild.family.displayName} · ${formatDate(selectedChild.birthDate)}` : ''}
        subjectName={selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''}
        title="Eliminar caso"
      />
    </div>
  )
}

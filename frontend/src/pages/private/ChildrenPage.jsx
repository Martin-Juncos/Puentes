import { useCallback, useMemo, useState } from 'react'
import { FiClipboard, FiMessageSquare, FiTrash2, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { PanelAccessNotice } from '@/components/private/PanelAccessNotice'
import { PanelSectionHeader } from '@/components/private/PanelSectionHeader'
import { PanelTableHeader } from '@/components/private/PanelTableHeader'
import { SelectionStateCard } from '@/components/private/SelectionStateCard'
import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { FormErrorAlert } from '@/components/ui/FormErrorAlert'
import { PanelCard } from '@/components/ui/PanelCard'
import { SuccessFeedbackModal } from '@/components/ui/SuccessFeedbackModal'
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
  disabilityCertificateIssuedAt: '',
  disabilityCertificateExpiresAt: '',
  disabilityCertificateIssuedBy: '',
}

const childUpdateInitial = {
  id: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  familyId: '',
  schoolName: '',
  notes: '',
  disabilityCertificateIssuedAt: '',
  disabilityCertificateExpiresAt: '',
  disabilityCertificateIssuedBy: '',
  status: 'ACTIVE',
}

const assignmentInitial = {
  childId: '',
  professionalId: '',
  serviceId: '',
  notes: '',
}

const formatDateInputValue = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '')

const buildChildUpdateForm = (child) => ({
  id: child.id,
  firstName: child.firstName ?? '',
  lastName: child.lastName ?? '',
  birthDate: formatDateInputValue(child.birthDate),
  familyId: child.family?.id ?? '',
  schoolName: child.schoolName ?? '',
  notes: child.notes ?? '',
  disabilityCertificateIssuedAt: formatDateInputValue(child.disabilityCertificateIssuedAt),
  disabilityCertificateExpiresAt: formatDateInputValue(child.disabilityCertificateExpiresAt),
  disabilityCertificateIssuedBy: child.disabilityCertificateIssuedBy ?? '',
  status: child.status ?? 'ACTIVE',
})

const DisabilityCertificateFields = ({ form, onChange }) => (
  <div className="md:col-span-2 grid gap-4 rounded-lg border border-[rgba(47,93,115,0.12)] p-4">
    <div className="space-y-1">
      <p className="field-label">Certificado de discapacidad</p>
      <p className="text-sm text-slate-500">Completá estos datos si el caso cuenta con certificado vigente.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Fecha de emisión">
        <input
          className="field-input"
          onChange={onChange('disabilityCertificateIssuedAt')}
          type="date"
          value={form.disabilityCertificateIssuedAt}
        />
      </Field>
      <Field label="Fecha de vencimiento">
        <input
          className="field-input"
          onChange={onChange('disabilityCertificateExpiresAt')}
          type="date"
          value={form.disabilityCertificateExpiresAt}
        />
      </Field>
      <Field label="Emitido por">
        <input
          className="field-input"
          onChange={onChange('disabilityCertificateIssuedBy')}
          value={form.disabilityCertificateIssuedBy}
        />
      </Field>
    </div>
  </div>
)

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

const successModalInitial = {
  isOpen: false,
  title: '',
  description: '',
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
  const [successModal, setSuccessModal] = useState(successModalInitial)

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

  const openChildMessages = useCallback(
    (childId) => {
      navigate(`/app/mensajes?childId=${childId}&compose=1`)
    },
    [navigate],
  )

  const childColumns = useMemo(
    () => [
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
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${childStatusClasses[row.status]}`}
          >
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
              `${assignment.professional.user.fullName}${
                assignment.service ? ` · ${assignment.service.name}` : ''
              }`,
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
    ],
    [childUpdateForm.id, openChildMessages],
  )

  const handleChildSelection = (event) => {
    const nextChild = children.find((child) => child.id === event.target.value)

    if (!nextChild) {
      setChildUpdateForm(childUpdateInitial)
      setChildUpdateError('')
      return
    }

    selectChildForUpdate(nextChild)
  }

  const closeSuccessModal = () => {
    setSuccessModal(successModalInitial)
  }

  const handleChildCreate = async (event) => {
    event.preventDefault()

    try {
      const nextChildName = `${childCreateForm.firstName} ${childCreateForm.lastName}`.trim()
      await childrenService.create(childCreateForm)
      setChildCreateForm(childCreateInitial)
      setChildCreateError('')
      await reload()
      setSuccessModal({
        isOpen: true,
        title: 'Caso creado',
        description: `${nextChildName || 'El caso'} ya quedó incorporado para seguimiento y agenda.`,
      })
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
        disabilityCertificateIssuedAt: childUpdateForm.disabilityCertificateIssuedAt,
        disabilityCertificateExpiresAt: childUpdateForm.disabilityCertificateExpiresAt,
        disabilityCertificateIssuedBy: childUpdateForm.disabilityCertificateIssuedBy,
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
      const assignmentChild = children.find((child) => child.id === assignmentForm.childId)
      const childName = assignmentChild
        ? `${assignmentChild.firstName} ${assignmentChild.lastName}`.trim()
        : ''
      await childrenService.assignProfessional(assignmentForm.childId, {
        professionalId: assignmentForm.professionalId,
        serviceId: assignmentForm.serviceId || undefined,
        notes: assignmentForm.notes,
      })
      setAssignmentForm(assignmentInitial)
      setAssignmentError('')
      await reload()
      setSuccessModal({
        isOpen: true,
        title: 'Asignación creada',
        description: childName
          ? `La asignación del caso ${childName} se guardó correctamente.`
          : 'La asignación se guardó correctamente.',
      })
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
        const remainingBlockers =
          currentDetails?.blockers?.filter((blocker) => blocker.key !== 'assignments') ?? []

        if (!remainingBlockers.length) {
          setDeleteError('')
          setDeleteStatusNotice({
            title: 'Listo para eliminar',
            description:
              'Las asignaciones se quitaron correctamente. Si no quedan otras relaciones pendientes, ya podés confirmar la eliminación.',
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
        label:
          resolutionActionKey === 'clear-assignments'
            ? 'Quitando asignaciones...'
            : 'Quitar asignaciones',
        onClick: handleClearAssignments,
        disabled: Boolean(resolutionActionKey),
      })
    }

    deleteResolutionActions.push(
      {
        key: 'status-paused',
        label:
          resolutionActionKey === 'status-PAUSED' ? 'Marcando en pausa...' : 'Marcar en pausa',
        onClick: () => handleResolveWithStatus('PAUSED'),
        disabled: Boolean(resolutionActionKey),
      },
      {
        key: 'status-discharged',
        label:
          resolutionActionKey === 'status-DISCHARGED' ? 'Marcando alta...' : 'Marcar alta',
        onClick: () => handleResolveWithStatus('DISCHARGED'),
        disabled: Boolean(resolutionActionKey),
      },
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <PanelSectionHeader
            description="Registro inicial del caso con familia asociada y datos básicos."
            icon={FiClipboard}
            title="Alta de niño o niña"
          />

          {!canManageChildren ? (
            <PanelAccessNotice>
              Como profesional, esta vista queda orientada a consulta de casos asignados. Las altas,
              ediciones y bajas corresponden a secretaría o coordinación.
            </PanelAccessNotice>
          ) : (
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleChildCreate}>
              <Field label="Nombre">
                <input
                  className="field-input"
                  onChange={updateCreateField('firstName')}
                  required
                  value={childCreateForm.firstName}
                />
              </Field>
              <Field label="Apellido">
                <input
                  className="field-input"
                  onChange={updateCreateField('lastName')}
                  required
                  value={childCreateForm.lastName}
                />
              </Field>
              <Field label="Fecha de nacimiento">
                <input
                  className="field-input"
                  onChange={updateCreateField('birthDate')}
                  required
                  type="date"
                  value={childCreateForm.birthDate}
                />
              </Field>
              <Field label="Familia asociada">
                <select
                  className="field-input"
                  onChange={updateCreateField('familyId')}
                  required
                  value={childCreateForm.familyId}
                >
                  <option value="">Seleccionar familia</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.displayName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Escuela">
                <input
                  className="field-input"
                  onChange={updateCreateField('schoolName')}
                  value={childCreateForm.schoolName}
                />
              </Field>
              <Field label="Observaciones básicas">
                <textarea
                  className="field-input min-h-24"
                  onChange={updateCreateField('notes')}
                  value={childCreateForm.notes}
                />
              </Field>

              <DisabilityCertificateFields form={childCreateForm} onChange={updateCreateField} />

              {childCreateError ? (
                <FormErrorAlert className="md:col-span-2">{childCreateError}</FormErrorAlert>
              ) : null}

              <div className="md:col-span-2">
                <Button type="submit">Guardar niño</Button>
              </div>
            </form>
          )}
        </PanelCard>

      <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
        <PanelSectionHeader
          description="Las asignaciones se definen desde secretarÃ­a o coordinaciÃ³n para sostener una agenda centralizada."
          icon={FiUserPlus}
          title="Asignar profesional"
          />

          {!canManageChildren ? (
            <PanelAccessNotice>
              Esta secciÃ³n queda visible para consulta, pero las asignaciones nuevas no estÃ¡n habilitadas
              para perfiles profesionales.
            </PanelAccessNotice>
          ) : (
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleAssignmentSubmit}>
              <Field label="Caso">
                <select
                  className="field-input"
                  onChange={updateAssignmentField('childId')}
                  required
                  value={assignmentForm.childId}
                >
                  <option value="">Seleccionar</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Profesional">
                <select
                  className="field-input"
                  onChange={updateAssignmentField('professionalId')}
                  required
                  value={assignmentForm.professionalId}
                >
                  <option value="">Seleccionar</option>
                  {professionals.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.user.fullName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Servicio">
                <select
                  className="field-input"
                  onChange={updateAssignmentField('serviceId')}
                  value={assignmentForm.serviceId}
                >
                  <option value="">Opcional</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Notas de asignaciÃ³n">
                <textarea
                  className="field-input min-h-24"
                  onChange={updateAssignmentField('notes')}
                  value={assignmentForm.notes}
                />
              </Field>

              {assignmentError ? (
                <FormErrorAlert className="md:col-span-2">{assignmentError}</FormErrorAlert>
              ) : null}

              <div className="md:col-span-2">
                <Button type="submit" variant="secondary">
                  Asignar profesional
                </Button>
              </div>
            </form>
          )}
        </PanelCard>

        <PanelCard className={!canManageChildren ? 'bg-[rgba(47,93,115,0.04)] xl:col-span-2' : 'xl:col-span-2'}>
          <PanelSectionHeader
            actions={
              selectedChild && canManageChildren ? (
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
              ) : null
            }
            description="Seleccioná un caso para cargar sus datos en edición."
            title="Actualizar o eliminar"
          />

          {!canManageChildren ? (
            <PanelAccessNotice>
              La edición y la baja de casos solo están disponibles para secretaría, coordinación y
              administración.
            </PanelAccessNotice>
          ) : (
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleChildUpdate}>
              <Field
                hint="También podés hacer clic sobre una fila del listado inferior."
                label="Caso seleccionado"
              >
                <select className="field-input" onChange={handleChildSelection} value={childUpdateForm.id}>
                  <option value="">Seleccionar caso</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </Field>

              <SelectionStateCard
                action={
                  selectedChild ? (
                    <Button
                      className="gap-2 px-3 py-2 text-xs"
                      onClick={() => openChildMessages(selectedChild.id)}
                      type="button"
                      variant="outline"
                    >
                      <FiMessageSquare aria-hidden="true" className="size-4" />
                      Abrir mensajes
                    </Button>
                  ) : null
                }
                emptyText="Seleccioná un caso para habilitar la edición."
                lines={
                  selectedChild
                    ? [
                        `Familia: ${selectedChild.family.displayName}`,
                        `Asignaciones: ${selectedChild.assignments.length}`,
                      ]
                    : []
                }
                title={selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''}
              />

              {selectedChild ? (
                <>
                  <Field label="Nombre">
                    <input
                      className="field-input"
                      onChange={updateChildField('firstName')}
                      required
                      value={childUpdateForm.firstName}
                    />
                  </Field>
                  <Field label="Apellido">
                    <input
                      className="field-input"
                      onChange={updateChildField('lastName')}
                      required
                      value={childUpdateForm.lastName}
                    />
                  </Field>
                  <Field label="Fecha de nacimiento">
                    <input
                      className="field-input"
                      onChange={updateChildField('birthDate')}
                      required
                      type="date"
                      value={childUpdateForm.birthDate}
                    />
                  </Field>
                  <Field label="Familia asociada">
                    <select
                      className="field-input"
                      onChange={updateChildField('familyId')}
                      required
                      value={childUpdateForm.familyId}
                    >
                      <option value="">Seleccionar familia</option>
                      {families.map((family) => (
                        <option key={family.id} value={family.id}>
                          {family.displayName}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Escuela">
                    <input
                      className="field-input"
                      onChange={updateChildField('schoolName')}
                      value={childUpdateForm.schoolName}
                    />
                  </Field>
                  <Field label="Estado">
                    <select className="field-input" onChange={updateChildField('status')} value={childUpdateForm.status}>
                      <option value="ACTIVE">Activo</option>
                      <option value="PAUSED">En pausa</option>
                      <option value="DISCHARGED">Alta</option>
                    </select>
                  </Field>
                  <Field label="Observaciones básicas">
                    <textarea
                      className="field-input min-h-24"
                      onChange={updateChildField('notes')}
                      value={childUpdateForm.notes}
                    />
                  </Field>
                </>
              ) : null}

              {selectedChild ? (
                <DisabilityCertificateFields form={childUpdateForm} onChange={updateChildField} />
              ) : null}

              {childUpdateError ? (
                <FormErrorAlert className="md:col-span-2">{childUpdateError}</FormErrorAlert>
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

      <PanelCard className="hidden">
        <PanelSectionHeader
          description="Las asignaciones se definen desde secretaría o coordinación para sostener una agenda centralizada."
          icon={FiUserPlus}
          title="Asignar profesional"
        />

        {!canManageChildren ? (
          <PanelAccessNotice>
            Esta sección queda visible para consulta, pero las asignaciones nuevas no están habilitadas
            para perfiles profesionales.
          </PanelAccessNotice>
        ) : (
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleAssignmentSubmit}>
            <Field label="Caso">
              <select
                className="field-input"
                onChange={updateAssignmentField('childId')}
                required
                value={assignmentForm.childId}
              >
                <option value="">Seleccionar</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Profesional">
              <select
                className="field-input"
                onChange={updateAssignmentField('professionalId')}
                required
                value={assignmentForm.professionalId}
              >
                <option value="">Seleccionar</option>
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.user.fullName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Servicio">
              <select
                className="field-input"
                onChange={updateAssignmentField('serviceId')}
                value={assignmentForm.serviceId}
              >
                <option value="">Opcional</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notas de asignación">
              <textarea
                className="field-input min-h-24"
                onChange={updateAssignmentField('notes')}
                value={assignmentForm.notes}
              />
            </Field>

            {assignmentError ? (
              <FormErrorAlert className="md:col-span-2">{assignmentError}</FormErrorAlert>
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
        <PanelTableHeader
          countLabel={`${children.length} casos`}
          description="Hacé clic sobre una fila para cargar el caso en actualización."
          title="Casos registrados"
        />

        <div className="mt-6">
          <DataTable
            columns={childColumns}
            getRowClassName={(row) =>
              childUpdateForm.id === row.id
                ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]'
                : ''
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
        subjectMeta={
          selectedChild ? `${selectedChild.family.displayName} · ${formatDate(selectedChild.birthDate)}` : ''
        }
        subjectName={selectedChild ? `${selectedChild.firstName} ${selectedChild.lastName}` : ''}
        title="Eliminar caso"
      />

      <SuccessFeedbackModal
        description={successModal.description}
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
      />
    </div>
  )
}

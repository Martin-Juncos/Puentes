import { useEffect, useMemo, useState } from 'react'
import { FiLayers, FiTrash2 } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { settingsService } from '@/services/settingsService'
import { servicesService } from '@/services/servicesService'

const createInitial = {
  name: '',
  description: '',
  durationMinutes: 60,
  colorTag: '#2F5D73',
}

const updateInitial = {
  id: '',
  name: '',
  description: '',
  durationMinutes: 60,
  colorTag: '#2F5D73',
  status: 'ACTIVE',
}

const buildUpdateForm = (service) => ({
  id: service.id,
  name: service.name ?? '',
  description: service.description ?? '',
  durationMinutes: service.durationMinutes ?? 60,
  colorTag: service.colorTag ?? '#2F5D73',
  status: service.status ?? 'ACTIVE',
})

const statusLabels = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
}

const statusClasses = {
  ACTIVE: 'bg-[rgba(167,196,181,0.2)] text-[#2f5d73]',
  INACTIVE: 'bg-[rgba(217,140,122,0.18)] text-[#8b4b3d]',
}

export const ServicesAdminPage = () => {
  const { user } = useAuth()
  const [createForm, setCreateForm] = useState(createInitial)
  const [updateForm, setUpdateForm] = useState(updateInitial)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteErrorDetails, setDeleteErrorDetails] = useState(null)
  const [deleteStatusNotice, setDeleteStatusNotice] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [resolutionActionKey, setResolutionActionKey] = useState('')
  const [defaultServiceDuration, setDefaultServiceDuration] = useState(60)

  const { data: services, reload } = useAsyncData(() => servicesService.listManage(), [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getManage()
        const nextDefaultDuration = settings.defaultServiceDurationMinutes ?? 60

        setDefaultServiceDuration(nextDefaultDuration)
        setCreateForm((current) => ({
          ...current,
          durationMinutes: nextDefaultDuration,
        }))
      } catch {
        setDefaultServiceDuration(60)
      }
    }

    loadSettings()
  }, [])

  const canManage = ['ADMIN', 'COORDINATION'].includes(user.role)
  const selectedService = useMemo(
    () => services.find((service) => service.id === updateForm.id) ?? null,
    [services, updateForm.id],
  )

  const updateCreateField = (field) => (event) =>
    setCreateForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const updateUpdateField = (field) => (event) =>
    setUpdateForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const selectServiceForUpdate = (service) => {
    setUpdateForm(buildUpdateForm(service))
    setUpdateError('')
  }

  const handleSelectionChange = (event) => {
    const nextService = services.find((service) => service.id === event.target.value)

    if (!nextService) {
      setUpdateForm(updateInitial)
      setUpdateError('')
      return
    }

    selectServiceForUpdate(nextService)
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      await servicesService.create({
        ...createForm,
        durationMinutes: Number(createForm.durationMinutes),
      })
      setCreateForm({
        ...createInitial,
        durationMinutes: defaultServiceDuration,
      })
      setCreateError('')
      await reload()
    } catch (error) {
      setCreateError(error.message)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    if (!updateForm.id) {
      return
    }

    try {
      const updatedService = await servicesService.update(updateForm.id, {
        name: updateForm.name,
        description: updateForm.description,
        durationMinutes: Number(updateForm.durationMinutes),
        colorTag: updateForm.colorTag,
        status: updateForm.status,
      })

      setUpdateForm(buildUpdateForm(updatedService))
      setUpdateError('')
      await reload()
    } catch (error) {
      setUpdateError(error.message)
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
    if (!selectedService) {
      return
    }

    try {
      setIsDeleting(true)
      await servicesService.remove(selectedService.id)
      setUpdateForm(updateInitial)
      setUpdateError('')
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

  const handleInactivateService = async () => {
    if (!selectedService) {
      return
    }

    try {
      setResolutionActionKey('inactivate-service')
      const updatedService = await servicesService.update(selectedService.id, { status: 'INACTIVE' })
      setUpdateForm(buildUpdateForm(updatedService))
      setUpdateError('')
      setDeleteError('')
      setDeleteErrorDetails(null)
      setDeleteStatusNotice({
        title: 'Servicio inactivado',
        description: 'El servicio quedó inactivo para preservar historial sin seguir ofreciéndolo en nuevas operaciones.',
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

  const deleteResolutionActions = deleteErrorDetails
    ? [
        {
          key: 'inactivate-service',
          label: resolutionActionKey === 'inactivate-service' ? 'Inactivando servicio...' : 'Inactivar servicio',
          onClick: handleInactivateService,
          disabled: Boolean(resolutionActionKey),
        },
      ]
    : []

  return (
    <div className="grid gap-6">
      <PanelCard>
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
            <FiLayers aria-hidden="true" className="size-5" />
          </div>
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Servicios del centro</h2>
            <p className="mt-2 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Los perfiles profesionales describen especialidades del equipo, mientras que los servicios representan las
              prestaciones concretas que el centro ofrece. Un profesional puede participar en distintos servicios y un
              servicio puede sostenerse con más de un perfil disciplinar según el abordaje.
            </p>
          </div>
        </div>
      </PanelCard>

      <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
        <PanelCard className={!canManage ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Crear servicio</h2>
          {!canManage ? (
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Esta sección queda visible para consulta operativa, pero la creación y edición de servicios corresponde a
              coordinación o administración.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
              <Field label="Nombre">
                <input className="field-input" onChange={updateCreateField('name')} required value={createForm.name} />
              </Field>
              <Field label="Descripción">
                <textarea className="field-input min-h-28" onChange={updateCreateField('description')} required value={createForm.description} />
              </Field>
              <Field label="Duración en minutos">
                <input
                  className="field-input"
                  min="15"
                  onChange={updateCreateField('durationMinutes')}
                  required
                  type="number"
                  value={createForm.durationMinutes}
                />
              </Field>
              <Field label="Color de referencia">
                <input className="field-input h-14" onChange={updateCreateField('colorTag')} type="color" value={createForm.colorTag} />
              </Field>
              {createError ? (
                <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{createError}</div>
              ) : null}
              <Button type="submit">Guardar servicio</Button>
            </form>
          )}
        </PanelCard>

        <PanelCard className={!canManage ? 'bg-[rgba(47,93,115,0.04)]' : ''}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Actualizar o eliminar</h2>
              <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                Seleccioná un servicio existente para editarlo o retirarlo de operación.
              </p>
            </div>
            {selectedService ? (
              <Button
                className="px-4 py-2"
                onClick={() => {
                  setUpdateForm(updateInitial)
                  setUpdateError('')
                }}
                type="button"
                variant="ghost"
              >
                Limpiar selección
              </Button>
            ) : null}
          </div>

          {!canManage ? (
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              La gestión de servicios queda reservada a coordinación o administración.
            </p>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleUpdate}>
              <Field hint="También podés hacer clic sobre una fila del listado inferior." label="Servicio seleccionado">
                <select className="field-input" onChange={handleSelectionChange} value={updateForm.id}>
                  <option value="">Seleccionar servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedService ? (
                <>
                  <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[rgba(46,46,46,0.74)]">
                    <p className="font-semibold text-[var(--color-primary)]">{selectedService.name}</p>
                    <p className="mt-1">Duración: {selectedService.durationMinutes} min</p>
                    <p className="mt-1">Estado: {statusLabels[selectedService.status] ?? selectedService.status}</p>
                  </div>

                  <Field label="Nombre">
                    <input className="field-input" onChange={updateUpdateField('name')} required value={updateForm.name} />
                  </Field>
                  <Field label="Descripción">
                    <textarea className="field-input min-h-28" onChange={updateUpdateField('description')} required value={updateForm.description} />
                  </Field>
                  <Field label="Duración en minutos">
                    <input
                      className="field-input"
                      min="15"
                      onChange={updateUpdateField('durationMinutes')}
                      required
                      type="number"
                      value={updateForm.durationMinutes}
                    />
                  </Field>
                  <Field label="Estado">
                    <select className="field-input" onChange={updateUpdateField('status')} value={updateForm.status}>
                      <option value="ACTIVE">Activo</option>
                      <option value="INACTIVE">Inactivo</option>
                    </select>
                  </Field>
                  <Field label="Color de referencia">
                    <input className="field-input h-14" onChange={updateUpdateField('colorTag')} type="color" value={updateForm.colorTag} />
                  </Field>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-3 text-sm text-[rgba(46,46,46,0.64)]">
                  Seleccioná un servicio del catálogo para habilitar la edición.
                </div>
              )}

              {updateError ? (
                <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{updateError}</div>
              ) : null}

              {selectedService ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
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
                    Eliminar servicio
                  </Button>
                </div>
              ) : null}
            </form>
          )}
        </PanelCard>
      </div>

      <PanelCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Servicios disponibles</h2>
            <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
              Hacé clic sobre una fila para cargarla en el panel de actualización.
            </p>
          </div>
          <div className="rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {services.length} servicios
          </div>
        </div>

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
              {
                key: 'status',
                label: 'Estado',
                render: (row) => (
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[row.status]}`}>
                    {statusLabels[row.status] ?? row.status}
                  </span>
                ),
              },
              {
                key: 'action',
                label: 'Acción',
                render: (row) => (
                  <Button className="px-3 py-2 text-xs" onClick={() => selectServiceForUpdate(row)} type="button" variant="outline">
                    {updateForm.id === row.id ? 'Seleccionado' : 'Editar'}
                  </Button>
                ),
              },
            ]}
            getRowClassName={(row) =>
              updateForm.id === row.id ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]' : ''
            }
            onRowClick={selectServiceForUpdate}
            rows={services}
          />
        </div>
      </PanelCard>

      <ConfirmDeleteModal
        key={`${selectedService?.id ?? 'empty'}-${isDeleteModalOpen ? 'open' : 'closed'}`}
        description={`Vas a eliminar ${selectedService?.name}. Si este servicio tiene sesiones o asignaciones asociadas, el sistema bloqueará la acción.`}
        error={deleteError}
        errorDetails={deleteErrorDetails}
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen && Boolean(selectedService)}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        resolutionActions={deleteResolutionActions}
        statusNotice={deleteStatusNotice}
        subjectMeta={selectedService ? `${selectedService.durationMinutes} min · ${statusLabels[selectedService.status] ?? selectedService.status}` : ''}
        subjectName={selectedService?.name ?? ''}
        title="Eliminar servicio"
      />
    </div>
  )
}

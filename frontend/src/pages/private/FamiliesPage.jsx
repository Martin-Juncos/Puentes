import { useMemo, useState } from 'react'
import { FiHome, FiTrash2, FiUsers } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { familiesService } from '@/services/familiesService'

const createInitial = {
  displayName: '',
  primaryContactName: '',
  primaryContactRelationship: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
}

const updateInitial = {
  id: '',
  displayName: '',
  primaryContactName: '',
  primaryContactRelationship: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  status: 'ACTIVE',
}

const buildUpdateForm = (family) => ({
  id: family.id,
  displayName: family.displayName ?? '',
  primaryContactName: family.primaryContactName ?? '',
  primaryContactRelationship: family.primaryContactRelationship ?? '',
  phone: family.phone ?? '',
  email: family.email ?? '',
  address: family.address ?? '',
  notes: family.notes ?? '',
  status: family.status ?? 'ACTIVE',
})

const statusLabels = {
  ACTIVE: 'Activa',
  ARCHIVED: 'Archivada',
}

const statusClasses = {
  ACTIVE: 'bg-[rgba(167,196,181,0.2)] text-[#2f5d73]',
  ARCHIVED: 'bg-[rgba(217,140,122,0.18)] text-[#8b4b3d]',
}

export const FamiliesPage = () => {
  const [createForm, setCreateForm] = useState(createInitial)
  const [updateForm, setUpdateForm] = useState(updateInitial)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteErrorDetails, setDeleteErrorDetails] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [resolutionActionKey, setResolutionActionKey] = useState('')
  const { data: families, reload } = useAsyncData(() => familiesService.list(), [])

  const selectedFamily = useMemo(
    () => families.find((family) => family.id === updateForm.id) ?? null,
    [families, updateForm.id],
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

  const selectFamilyForUpdate = (family) => {
    setUpdateForm(buildUpdateForm(family))
    setUpdateError('')
  }

  const handleUpdateSelection = (event) => {
    const nextFamily = families.find((family) => family.id === event.target.value)

    if (!nextFamily) {
      setUpdateForm(updateInitial)
      setUpdateError('')
      return
    }

    selectFamilyForUpdate(nextFamily)
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      await familiesService.create(createForm)
      setCreateForm(createInitial)
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
      const updatedFamily = await familiesService.update(updateForm.id, {
        displayName: updateForm.displayName,
        primaryContactName: updateForm.primaryContactName,
        primaryContactRelationship: updateForm.primaryContactRelationship,
        phone: updateForm.phone,
        email: updateForm.email,
        address: updateForm.address,
        notes: updateForm.notes,
        status: updateForm.status,
      })

      setUpdateForm(buildUpdateForm(updatedFamily))
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
    setIsDeleteModalOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedFamily) {
      return
    }

    try {
      setIsDeleting(true)
      await familiesService.remove(selectedFamily.id)
      setUpdateForm(updateInitial)
      setUpdateError('')
      setDeleteError('')
      setDeleteErrorDetails(null)
      setIsDeleteModalOpen(false)
      await reload()
    } catch (error) {
      setDeleteError(error.message)
      setDeleteErrorDetails(error.details ?? null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleArchiveFamily = async () => {
    if (!selectedFamily) {
      return
    }

    try {
      setResolutionActionKey('archive-family')
      const updatedFamily = await familiesService.update(selectedFamily.id, { status: 'ARCHIVED' })
      setUpdateForm(buildUpdateForm(updatedFamily))
      setUpdateError('')
      setDeleteError('')
      setDeleteErrorDetails(null)
      setIsDeleteModalOpen(false)
      await reload()
    } catch (error) {
      setDeleteError(error.message)
      setDeleteErrorDetails(error.details ?? null)
    } finally {
      setResolutionActionKey('')
    }
  }

  const deleteResolutionActions = deleteErrorDetails
    ? [
        {
          key: 'archive-family',
          label: resolutionActionKey === 'archive-family' ? 'Archivando familia...' : 'Archivar familia',
          onClick: handleArchiveFamily,
          disabled: Boolean(resolutionActionKey),
        },
      ]
    : []

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
        <PanelCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
              <FiHome aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Alta de familia</h2>
              <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                Base administrativa para contacto, seguimiento y articulación operativa.
              </p>
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
            <Field label="Nombre de referencia">
              <input className="field-input" onChange={updateCreateField('displayName')} required value={createForm.displayName} />
            </Field>
            <Field label="Contacto principal">
              <input
                className="field-input"
                onChange={updateCreateField('primaryContactName')}
                required
                value={createForm.primaryContactName}
              />
            </Field>
            <Field label="Relación">
              <input
                className="field-input"
                onChange={updateCreateField('primaryContactRelationship')}
                required
                value={createForm.primaryContactRelationship}
              />
            </Field>
            <Field label="Teléfono">
              <input className="field-input" onChange={updateCreateField('phone')} required value={createForm.phone} />
            </Field>
            <Field label="Email">
              <input className="field-input" onChange={updateCreateField('email')} type="email" value={createForm.email} />
            </Field>
            <Field label="Dirección">
              <input className="field-input" onChange={updateCreateField('address')} value={createForm.address} />
            </Field>
            <Field label="Notas">
              <textarea className="field-input min-h-24" onChange={updateCreateField('notes')} value={createForm.notes} />
            </Field>
            {createError ? (
              <div className="md:col-span-2 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
                {createError}
              </div>
            ) : null}
            <div className="md:col-span-2">
              <Button type="submit">Guardar familia</Button>
            </div>
          </form>
        </PanelCard>

        <PanelCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Actualizar o eliminar</h2>
              <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                Seleccioná una familia desde la tabla o el selector para cargar sus datos.
              </p>
            </div>
            {selectedFamily ? (
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

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleUpdate}>
            <Field hint="También podés hacer clic sobre una fila del listado inferior." label="Familia seleccionada">
              <select className="field-input" onChange={handleUpdateSelection} value={updateForm.id}>
                <option value="">Seleccionar familia</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.displayName}
                  </option>
                ))}
              </select>
            </Field>

            {selectedFamily ? (
              <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.04)] px-4 py-3 text-sm text-[rgba(46,46,46,0.74)]">
                <p className="font-semibold text-[var(--color-primary)]">{selectedFamily.displayName}</p>
                <p className="mt-1">Contacto: {selectedFamily.primaryContactName}</p>
                <p className="mt-1">Niños registrados: {selectedFamily.children.length}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-3 text-sm text-[rgba(46,46,46,0.64)]">
                Seleccioná una familia para habilitar la edición.
              </div>
            )}

            {selectedFamily ? (
              <>
                <Field label="Nombre de referencia">
                  <input className="field-input" onChange={updateUpdateField('displayName')} required value={updateForm.displayName} />
                </Field>
                <Field label="Contacto principal">
                  <input
                    className="field-input"
                    onChange={updateUpdateField('primaryContactName')}
                    required
                    value={updateForm.primaryContactName}
                  />
                </Field>
                <Field label="Relación">
                  <input
                    className="field-input"
                    onChange={updateUpdateField('primaryContactRelationship')}
                    required
                    value={updateForm.primaryContactRelationship}
                  />
                </Field>
                <Field label="Teléfono">
                  <input className="field-input" onChange={updateUpdateField('phone')} required value={updateForm.phone} />
                </Field>
                <Field label="Email">
                  <input className="field-input" onChange={updateUpdateField('email')} type="email" value={updateForm.email} />
                </Field>
                <Field label="Estado">
                  <select className="field-input" onChange={updateUpdateField('status')} value={updateForm.status}>
                    <option value="ACTIVE">Activa</option>
                    <option value="ARCHIVED">Archivada</option>
                  </select>
                </Field>
                <Field label="Dirección">
                  <input className="field-input" onChange={updateUpdateField('address')} value={updateForm.address} />
                </Field>
                <Field label="Notas">
                  <textarea className="field-input min-h-24" onChange={updateUpdateField('notes')} value={updateForm.notes} />
                </Field>
              </>
            ) : null}

            {updateError ? (
              <div className="md:col-span-2 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
                {updateError}
              </div>
            ) : null}

            {selectedFamily ? (
              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button type="submit" variant="secondary">
                  Guardar cambios
                </Button>
                <Button
                  className="px-4 py-3 text-[#8b4b3d] hover:bg-[rgba(217,140,122,0.12)]"
                  onClick={() => {
                    setDeleteError('')
                    setDeleteErrorDetails(null)
                    setIsDeleteModalOpen(true)
                  }}
                  type="button"
                  variant="ghost"
                >
                  <FiTrash2 aria-hidden="true" className="mr-2 size-4" />
                  Eliminar familia
                </Button>
              </div>
            ) : null}
          </form>
        </PanelCard>
      </div>

      <PanelCard>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Familias registradas</h2>
            <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
              Hacé clic en una fila para cargarla en el panel de actualización.
            </p>
          </div>
          <div className="rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {families.length} familias
          </div>
        </div>

        <div className="mt-6">
          <DataTable
            columns={[
              { key: 'displayName', label: 'Familia' },
              { key: 'primaryContactName', label: 'Contacto principal' },
              { key: 'phone', label: 'Teléfono' },
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
                key: 'children',
                label: 'Niños',
                render: (row) => row.children.map((child) => `${child.firstName} ${child.lastName}`).join(', ') || 'Sin registros',
              },
              {
                key: 'action',
                label: 'Acción',
                render: (row) => (
                  <Button className="px-3 py-2 text-xs" onClick={() => selectFamilyForUpdate(row)} type="button" variant="outline">
                    {updateForm.id === row.id ? 'Seleccionada' : 'Editar'}
                  </Button>
                ),
              },
            ]}
            getRowClassName={(row) =>
              updateForm.id === row.id ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]' : ''
            }
            onRowClick={selectFamilyForUpdate}
            rows={families}
          />
        </div>
      </PanelCard>

      <ConfirmDeleteModal
        key={`${selectedFamily?.id ?? 'empty'}-${isDeleteModalOpen ? 'open' : 'closed'}`}
        description={`Vas a eliminar a ${selectedFamily?.displayName}. Si tiene niños, niñas o pagos asociados, el sistema bloqueará la acción.`}
        error={deleteError}
        errorDetails={deleteErrorDetails}
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen && Boolean(selectedFamily)}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        resolutionActions={deleteResolutionActions}
        subjectMeta={selectedFamily ? `${selectedFamily.primaryContactName} · ${selectedFamily.phone}` : ''}
        subjectName={selectedFamily?.displayName ?? ''}
        title="Eliminar familia"
      />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiTrash2, FiUserCheck, FiUsers } from 'react-icons/fi'

import { PanelSectionHeader } from '@/components/private/PanelSectionHeader'
import { PanelTableHeader } from '@/components/private/PanelTableHeader'
import { SelectionStateCard } from '@/components/private/SelectionStateCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import { FormErrorAlert } from '@/components/ui/FormErrorAlert'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { PROFESSIONAL_DISCIPLINES } from '@/constants/professionalDisciplines'
import { ROLE_LABELS } from '@/constants/roles'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usersService } from '@/services/usersService'

const createInitial = {
  fullName: '',
  email: '',
  password: '',
  role: 'SECRETARY',
  phone: '',
  professionalDiscipline: '',
}

const updateInitial = {
  id: '',
  fullName: '',
  email: '',
  password: '',
  role: 'SECRETARY',
  status: 'ACTIVE',
  phone: '',
  professionalDiscipline: '',
}

const statusClasses = {
  ACTIVE: 'bg-[rgba(167,196,181,0.2)] text-[#2f5d73]',
  INACTIVE: 'bg-[rgba(217,140,122,0.18)] text-[#8b4b3d]',
}

const roleRequiresDiscipline = (role) => role === 'PROFESSIONAL'

const formatLastAccess = (value) => {
  if (!value) {
    return 'Sin ingresos aún'
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

const buildUpdateForm = (user) => ({
  id: user.id,
  fullName: user.fullName ?? '',
  email: user.email ?? '',
  password: '',
  role: user.role ?? 'SECRETARY',
  status: user.status ?? 'ACTIVE',
  phone: user.phone ?? '',
  professionalDiscipline: user.professionalProfile?.discipline ?? '',
})

export const UsersPage = () => {
  const [createForm, setCreateForm] = useState(createInitial)
  const [updateForm, setUpdateForm] = useState(updateInitial)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: users, reload } = useAsyncData(() => usersService.list(), [])

  const activeUsersCount = useMemo(
    () => users.filter((user) => user.status === 'ACTIVE').length,
    [users],
  )
  const professionalUsersCount = useMemo(
    () => users.filter((user) => user.role === 'PROFESSIONAL').length,
    [users],
  )
  const selectedUser = useMemo(
    () => users.find((user) => user.id === updateForm.id) ?? null,
    [users, updateForm.id],
  )

  const updateCreateField = (field) => (event) => {
    const value = event.target.value

    setCreateForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'role' && value !== 'PROFESSIONAL'
        ? { professionalDiscipline: '' }
        : {}),
    }))
  }

  const updateUpdateField = (field) => (event) => {
    const value = event.target.value

    setUpdateForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'role' && value !== 'PROFESSIONAL'
        ? { professionalDiscipline: '' }
        : {}),
    }))
  }

  const selectUserForUpdate = (user) => {
    setUpdateForm(buildUpdateForm(user))
    setUpdateError('')
  }

  const handleUpdateSelection = (event) => {
    const nextUser = users.find((user) => user.id === event.target.value)

    if (!nextUser) {
      setUpdateForm(updateInitial)
      setUpdateError('')
      return
    }

    selectUserForUpdate(nextUser)
  }

  const closeDeleteModal = () => {
    if (isDeleting) {
      return
    }

    setIsDeleteModalOpen(false)
    setDeleteError('')
  }

  const openDeleteModal = () => {
    if (!selectedUser) {
      return
    }

    setDeleteError('')
    setIsDeleteModalOpen(true)
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
        phone: createForm.phone,
      }

      if (roleRequiresDiscipline(createForm.role)) {
        payload.professionalDiscipline = createForm.professionalDiscipline
      }

      await usersService.create(payload)
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
      const payload = {
        fullName: updateForm.fullName,
        email: updateForm.email,
        role: updateForm.role,
        status: updateForm.status,
        phone: updateForm.phone,
      }

      if (updateForm.password.trim()) {
        payload.password = updateForm.password
      }

      if (roleRequiresDiscipline(updateForm.role)) {
        payload.professionalDiscipline = updateForm.professionalDiscipline
      }

      const updatedUser = await usersService.update(updateForm.id, payload)
      setUpdateForm(buildUpdateForm(updatedUser))
      setUpdateError('')
      await reload()
    } catch (error) {
      setUpdateError(error.message)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) {
      return
    }

    try {
      setIsDeleting(true)
      await usersService.remove(selectedUser.id)
      setUpdateForm(updateInitial)
      setUpdateError('')
      setDeleteError('')
      setIsDeleteModalOpen(false)
      await reload()
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <PanelCard className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge>Administración interna</Badge>
            <h1 className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">
              Usuarios del sistema
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Desde acá podés dar de alta nuevos accesos, seleccionar un usuario ya creado para
              editarlo y confirmar su eliminación cuando corresponda.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-white/80 px-4 py-4">
              <div className="flex items-center gap-3 text-[var(--color-primary)]">
                <FiUsers aria-hidden="true" className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">Total</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-primary)]">
                {users.length}
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-white/80 px-4 py-4">
              <div className="flex items-center gap-3 text-[var(--color-primary)]">
                <FiUserCheck aria-hidden="true" className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">Activos</span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-primary)]">
                {activeUsersCount}
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(47,93,115,0.1)] bg-white/80 px-4 py-4">
              <div className="flex items-center gap-3 text-[var(--color-primary)]">
                <FiEdit2 aria-hidden="true" className="size-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                  Profesionales
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-primary)]">
                {professionalUsersCount}
              </p>
            </div>
          </div>
        </div>
      </PanelCard>

      <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
        <PanelCard>
          <PanelSectionHeader
            description="Si el rol es profesional, definí el tipo desde el alta."
            icon={FiPlus}
            title="Crear usuario"
          />

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
            <Field label="Nombre completo">
              <input
                className="field-input"
                onChange={updateCreateField('fullName')}
                required
                value={createForm.fullName}
              />
            </Field>
            <Field label="Email">
              <input
                className="field-input"
                onChange={updateCreateField('email')}
                required
                type="email"
                value={createForm.email}
              />
            </Field>
            <Field label="Contraseña inicial">
              <input
                className="field-input"
                minLength={6}
                onChange={updateCreateField('password')}
                required
                type="password"
                value={createForm.password}
              />
            </Field>
            <Field label="Rol">
              <select
                className="field-input"
                onChange={updateCreateField('role')}
                value={createForm.role}
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            {roleRequiresDiscipline(createForm.role) ? (
              <Field
                hint="Este dato crea automáticamente el perfil profesional básico."
                label="Tipo de profesional"
              >
                <select
                  className="field-input"
                  onChange={updateCreateField('professionalDiscipline')}
                  required
                  value={createForm.professionalDiscipline}
                >
                  <option value="">Seleccionar tipo</option>
                  {PROFESSIONAL_DISCIPLINES.map((discipline) => (
                    <option key={discipline} value={discipline}>
                      {discipline}
                    </option>
                  ))}
                </select>
              </Field>
            ) : null}
            <Field label="Teléfono">
              <input
                className="field-input"
                onChange={updateCreateField('phone')}
                value={createForm.phone}
              />
            </Field>
            {createError ? <FormErrorAlert className="md:col-span-2">{createError}</FormErrorAlert> : null}
            <div className="md:col-span-2 flex justify-start">
              <Button type="submit">Crear usuario</Button>
            </div>
          </form>
        </PanelCard>

        <PanelCard>
          <PanelSectionHeader
            actions={
              selectedUser ? (
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
              ) : null
            }
            description="Elegí un usuario desde la tabla o desde este selector para cargar sus datos."
            title="Actualizar o eliminar"
          />

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleUpdate}>
            <Field
              hint="También podés hacer clic sobre una fila del listado inferior."
              label="Usuario seleccionado"
            >
              <select className="field-input" onChange={handleUpdateSelection} value={updateForm.id}>
                <option value="">Seleccionar usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} · {ROLE_LABELS[user.role] ?? user.role}
                  </option>
                ))}
              </select>
            </Field>

            <SelectionStateCard
              emptyText="Seleccioná un usuario para habilitar la edición."
              lines={
                selectedUser
                  ? [
                      `Último acceso: ${formatLastAccess(selectedUser.lastLoginAt)}`,
                      selectedUser.professionalProfile?.discipline
                        ? `Perfil profesional: ${selectedUser.professionalProfile.discipline}`
                        : null,
                    ].filter(Boolean)
                  : []
              }
              title={selectedUser?.fullName}
            />

            {selectedUser ? (
              <>
                <Field label="Nombre completo">
                  <input
                    className="field-input"
                    onChange={updateUpdateField('fullName')}
                    required
                    value={updateForm.fullName}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className="field-input"
                    onChange={updateUpdateField('email')}
                    required
                    type="email"
                    value={updateForm.email}
                  />
                </Field>
                <Field hint="Dejá este campo vacío si no querés cambiarla." label="Nueva contraseña">
                  <input
                    className="field-input"
                    minLength={6}
                    onChange={updateUpdateField('password')}
                    type="password"
                    value={updateForm.password}
                  />
                </Field>
                <Field label="Teléfono">
                  <input
                    className="field-input"
                    onChange={updateUpdateField('phone')}
                    value={updateForm.phone}
                  />
                </Field>
                <Field label="Rol">
                  <select
                    className="field-input"
                    onChange={updateUpdateField('role')}
                    value={updateForm.role}
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Estado">
                  <select
                    className="field-input"
                    onChange={updateUpdateField('status')}
                    value={updateForm.status}
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </Field>
                {roleRequiresDiscipline(updateForm.role) ? (
                  <Field
                    hint="Se mantiene sincronizado con el perfil profesional del usuario."
                    label="Tipo de profesional"
                  >
                    <select
                      className="field-input"
                      onChange={updateUpdateField('professionalDiscipline')}
                      required
                      value={updateForm.professionalDiscipline}
                    >
                      <option value="">Seleccionar tipo</option>
                      {PROFESSIONAL_DISCIPLINES.map((discipline) => (
                        <option key={discipline} value={discipline}>
                          {discipline}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}
              </>
            ) : null}

            {updateError ? <FormErrorAlert className="md:col-span-2">{updateError}</FormErrorAlert> : null}

            {selectedUser ? (
              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button type="submit" variant="secondary">
                  Guardar cambios
                </Button>
                <Button
                  className="px-4 py-3 text-[#8b4b3d] hover:bg-[rgba(217,140,122,0.12)]"
                  onClick={openDeleteModal}
                  type="button"
                  variant="ghost"
                >
                  <FiTrash2 aria-hidden="true" className="mr-2 size-4" />
                  Eliminar usuario
                </Button>
              </div>
            ) : null}
          </form>
        </PanelCard>
      </div>

      <PanelCard>
        <PanelTableHeader
          countLabel={selectedUser ? `Editando ${selectedUser.fullName}` : `${users.length} usuarios`}
          description="Hacé clic sobre una fila para cargar sus datos en el panel de actualización."
          title="Lista de usuarios"
        />

        <div className="mt-6">
          <DataTable
            columns={[
              {
                key: 'fullName',
                label: 'Usuario',
                render: (row) => (
                  <div>
                    <p className="font-semibold text-[var(--color-primary)]">{row.fullName}</p>
                    <p className="mt-1 text-xs text-[rgba(46,46,46,0.62)]">{row.email}</p>
                  </div>
                ),
              },
              {
                key: 'role',
                label: 'Rol',
                render: (row) => (
                  <div>
                    <p>{ROLE_LABELS[row.role] ?? row.role}</p>
                    {row.professionalProfile?.discipline ? (
                      <p className="mt-1 text-xs text-[rgba(46,46,46,0.62)]">
                        {row.professionalProfile.discipline}
                      </p>
                    ) : null}
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Estado',
                render: (row) => (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[row.status]}`}
                  >
                    {row.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                ),
              },
              {
                key: 'phone',
                label: 'Teléfono',
                render: (row) => row.phone || 'Sin teléfono',
              },
              {
                key: 'lastLoginAt',
                label: 'Último acceso',
                render: (row) => formatLastAccess(row.lastLoginAt),
              },
              {
                key: 'action',
                label: 'Acción',
                render: (row) => (
                  <Button
                    className="px-3 py-2 text-xs"
                    onClick={() => selectUserForUpdate(row)}
                    type="button"
                    variant="outline"
                  >
                    {updateForm.id === row.id ? 'Seleccionado' : 'Editar'}
                  </Button>
                ),
              },
            ]}
            getRowClassName={(row) =>
              updateForm.id === row.id
                ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]'
                : ''
            }
            onRowClick={selectUserForUpdate}
            rows={users}
          />
        </div>
      </PanelCard>

      <ConfirmDeleteModal
        key={`${selectedUser?.id ?? 'empty'}-${isDeleteModalOpen ? 'open' : 'closed'}`}
        description={`Vas a eliminar a ${selectedUser?.fullName}. Si el usuario tiene registros vinculados, el sistema bloqueará la acción.`}
        error={deleteError}
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen && Boolean(selectedUser)}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        subjectMeta={selectedUser?.email}
        subjectName={selectedUser?.fullName ?? ''}
        title="Eliminar usuario"
      />
    </div>
  )
}

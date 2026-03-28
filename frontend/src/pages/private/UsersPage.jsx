import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usersService } from '@/services/usersService'

const createInitial = {
  fullName: '',
  email: '',
  password: '',
  role: 'SECRETARY',
  phone: '',
}

const updateInitial = {
  id: '',
  role: 'SECRETARY',
  status: 'ACTIVE',
}

export const UsersPage = () => {
  const [createForm, setCreateForm] = useState(createInitial)
  const [updateForm, setUpdateForm] = useState(updateInitial)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const { data: users, reload } = useAsyncData(() => usersService.list(), [])

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

  const handleCreate = async (event) => {
    event.preventDefault()

    try {
      await usersService.create(createForm)
      setCreateForm(createInitial)
      setCreateError('')
      reload()
    } catch (error) {
      setCreateError(error.message)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    try {
      await usersService.update(updateForm.id, {
        role: updateForm.role,
        status: updateForm.status,
      })
      setUpdateForm(updateInitial)
      setUpdateError('')
      reload()
    } catch (error) {
      setUpdateError(error.message)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Crear usuario</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleCreate}>
            <Field label="Nombre completo">
              <input className="field-input" onChange={updateCreateField('fullName')} required value={createForm.fullName} />
            </Field>
            <Field label="Email">
              <input className="field-input" onChange={updateCreateField('email')} required type="email" value={createForm.email} />
            </Field>
            <Field label="Contraseña inicial">
              <input className="field-input" onChange={updateCreateField('password')} required type="password" value={createForm.password} />
            </Field>
            <Field label="Rol">
              <select className="field-input" onChange={updateCreateField('role')} value={createForm.role}>
                <option value="ADMIN">Administrador</option>
                <option value="COORDINATION">Coordinación</option>
                <option value="SECRETARY">Secretaría</option>
                <option value="PROFESSIONAL">Profesional</option>
              </select>
            </Field>
            <Field label="Teléfono">
              <input className="field-input" onChange={updateCreateField('phone')} value={createForm.phone} />
            </Field>
            {createError ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{createError}</div> : null}
            <Button type="submit">Crear usuario</Button>
          </form>
        </PanelCard>

        <PanelCard>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Actualizar rol o estado</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleUpdate}>
            <Field label="Usuario">
              <select className="field-input" onChange={updateUpdateField('id')} required value={updateForm.id}>
                <option value="">Seleccionar</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} · {user.role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rol">
              <select className="field-input" onChange={updateUpdateField('role')} value={updateForm.role}>
                <option value="ADMIN">Administrador</option>
                <option value="COORDINATION">Coordinación</option>
                <option value="SECRETARY">Secretaría</option>
                <option value="PROFESSIONAL">Profesional</option>
              </select>
            </Field>
            <Field label="Estado">
              <select className="field-input" onChange={updateUpdateField('status')} value={updateForm.status}>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </Field>
            {updateError ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{updateError}</div> : null}
            <Button type="submit" variant="secondary">
              Actualizar usuario
            </Button>
          </form>
        </PanelCard>
      </div>

      <PanelCard>
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Usuarios del sistema</h2>
        <div className="mt-6">
          <DataTable
            columns={[
              { key: 'fullName', label: 'Nombre' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Rol' },
              { key: 'status', label: 'Estado' },
              { key: 'phone', label: 'Teléfono' },
            ]}
            rows={users}
          />
        </div>
      </PanelCard>
    </div>
  )
}

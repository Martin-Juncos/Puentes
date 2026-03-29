import { useMemo, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { followUpsService } from '@/services/followUpsService'
import { professionalsService } from '@/services/professionalsService'
import { formatDate } from '@/utils/formatters'
import { getRichTextPlainText, getRichTextPreview, sanitizeRichText } from '@/utils/richText'

const initialForm = {
  id: '',
  childId: '',
  professionalId: '',
  followUpDate: '',
  title: '',
  summary: '',
  note: '',
}

const toInputDate = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const buildFollowUpForm = (followUp) => ({
  id: followUp.id,
  childId: followUp.childId ?? followUp.child?.id ?? '',
  professionalId: followUp.professionalId ?? followUp.professional?.id ?? '',
  followUpDate: toInputDate(followUp.followUpDate ?? followUp.session?.startsAt ?? followUp.createdAt),
  title: followUp.title ?? '',
  summary: followUp.summary ?? '',
  note: followUp.note ?? '',
})

export const FollowUpsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: followUps,
    error: followUpsError,
    setData: setFollowUps,
  } = useAsyncData(() => followUpsService.list(), [])
  const { data: children } = useAsyncData(() => childrenService.list(), [])
  const { data: professionals } = useAsyncData(() => professionalsService.listManage(), [])

  const canChooseProfessional = ['ADMIN', 'COORDINATION'].includes(user.role)
  const isEditing = Boolean(form.id)

  const selectedFollowUp = useMemo(
    () => followUps.find((followUp) => followUp.id === form.id) ?? null,
    [followUps, form.id],
  )
  const deleteTarget = useMemo(
    () => followUps.find((followUp) => followUp.id === deleteTargetId) ?? null,
    [deleteTargetId, followUps],
  )

  const updateField = (field) => (event) => {
    const nextValue = event.target.value

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }))

    if (error) {
      setError('')
    }
  }

  const updateNote = (nextValue) => {
    setForm((current) => ({
      ...current,
      note: nextValue,
    }))

    if (error) {
      setError('')
    }
  }

  const resetForm = () => {
    setForm(initialForm)
    setError('')
  }

  const selectFollowUpForEdit = (followUp) => {
    setForm(buildFollowUpForm(followUp))
    setError('')
  }

  const buildCreatePayload = (sanitizedNote) => ({
    childId: form.childId,
    professionalId: canChooseProfessional ? form.professionalId : undefined,
    followUpDate: form.followUpDate,
    title: form.title.trim() ? form.title.trim() : undefined,
    summary: form.summary.trim() ? form.summary.trim() : undefined,
    note: sanitizedNote,
  })

  const buildUpdatePayload = (sanitizedNote) => ({
    childId: form.childId,
    professionalId: canChooseProfessional ? form.professionalId : undefined,
    followUpDate: form.followUpDate,
    title: form.title.trim() ? form.title.trim() : null,
    summary: form.summary.trim() ? form.summary.trim() : null,
    note: sanitizedNote,
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const sanitizedNote = sanitizeRichText(form.note)

    if (getRichTextPlainText(sanitizedNote).length < 10) {
      setError('La nota debe tener al menos 10 caracteres de contenido real.')
      return
    }

    try {
      if (isEditing) {
        const updatedFollowUp = await followUpsService.update(form.id, buildUpdatePayload(sanitizedNote))

        setFollowUps((current) =>
          (current ?? []).map((followUp) => (followUp.id === updatedFollowUp.id ? updatedFollowUp : followUp)),
        )
        setForm(buildFollowUpForm(updatedFollowUp))
      } else {
        const createdFollowUp = await followUpsService.create(buildCreatePayload(sanitizedNote))

        setFollowUps((current) => [createdFollowUp, ...(current ?? [])])
        setForm(initialForm)
      }

      setError('')
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  const openDeleteModal = (followUp) => {
    setDeleteTargetId(followUp.id)
    setDeleteError('')
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    if (isDeleting) {
      return
    }

    setDeleteTargetId('')
    setDeleteError('')
    setIsDeleteModalOpen(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setIsDeleting(true)
      await followUpsService.remove(deleteTarget.id)
      setFollowUps((current) => (current ?? []).filter((followUp) => followUp.id !== deleteTarget.id))

      if (form.id === deleteTarget.id) {
        setForm(initialForm)
        setError('')
      }

      setDeleteError('')
      setDeleteTargetId('')
      setIsDeleteModalOpen(false)
    } catch (deleteRequestError) {
      setDeleteError(deleteRequestError.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <PanelCard className="xl:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
              {isEditing ? 'Editar seguimiento' : 'Nuevo seguimiento'}
            </h2>
            <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
              {isEditing
                ? 'Modificá el informe seleccionado y guardá los cambios.'
                : 'Registrá un informe clínico u operativo del proceso de acompañamiento.'}
            </p>
          </div>
          {isEditing ? (
            <Button onClick={resetForm} type="button" variant="ghost">
              Cancelar edición
            </Button>
          ) : null}
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Field label="Niño o niña">
            <select className="field-input" onChange={updateField('childId')} required value={form.childId}>
              <option value="">Seleccionar</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </Field>
          <Field hint="Se abre el calendario nativo del navegador para elegir el día." label="Fecha">
            <input className="field-input" onChange={updateField('followUpDate')} required type="date" value={form.followUpDate} />
          </Field>
          {canChooseProfessional ? (
            <Field label="Profesional responsable">
              <select className="field-input" onChange={updateField('professionalId')} required value={form.professionalId}>
                <option value="">Seleccionar</option>
                {professionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.user.fullName}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
          <Field label="Título">
            <input className="field-input" onChange={updateField('title')} value={form.title} />
          </Field>
          <div className="md:col-span-2">
            <Field hint="Una síntesis breve para identificar el informe más rápido." label="Resumen">
              <input className="field-input" onChange={updateField('summary')} value={form.summary} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field
              hint="Podés usar negrita, cursiva, subrayado, listas, pegar desde el portapapeles y quitar formato."
              label="Nota de seguimiento"
            >
              <RichTextEditor onChange={updateNote} value={form.note} />
            </Field>
          </div>
          {error ? (
            <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d] md:col-span-2">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-between">
            <Button type="submit" variant={isEditing ? 'secondary' : 'primary'}>
              {isEditing ? 'Guardar cambios' : 'Guardar seguimiento'}
            </Button>
            {isEditing ? (
              <Button
                className="px-4 py-3 text-[#8b4b3d] hover:bg-[rgba(217,140,122,0.12)]"
                onClick={() => openDeleteModal(selectedFollowUp)}
                type="button"
                variant="ghost"
              >
                <FiTrash2 aria-hidden="true" className="mr-2 size-4" />
                Eliminar seguimiento
              </Button>
            ) : null}
          </div>
        </form>
      </PanelCard>

      <PanelCard className="xl:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Seguimientos cargados</h2>
            <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
              Hacé clic en una fila para cargarla en el formulario y editarla, o abrí el informe para imprimirlo.
            </p>
          </div>
          <div className="rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {followUps.length} informes
          </div>
        </div>

        <div className="mt-6">
          {followUpsError ? (
            <div className="mb-4 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
              No pudimos cargar los seguimientos guardados. {followUpsError.message}
            </div>
          ) : null}
          <DataTable
            columns={[
              {
                key: 'child',
                label: 'Caso',
                render: (row) => `${row.child.firstName} ${row.child.lastName}`,
              },
              {
                key: 'followUpDate',
                label: 'Fecha',
                render: (row) => formatDate(row.followUpDate ?? row.session?.startsAt ?? row.createdAt),
              },
              {
                key: 'title',
                label: 'Título',
                render: (row) => row.title || 'Sin título',
              },
              {
                key: 'summary',
                label: 'Resumen',
                render: (row) => row.summary || 'Sin resumen',
              },
              {
                key: 'note',
                label: 'Nota',
                render: (row) => (
                  <div className="max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[rgba(46,46,46,0.82)]">
                    {getRichTextPreview(row.note)}
                  </div>
                ),
              },
              {
                key: 'action',
                label: 'Acción',
                render: (row) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      aria-label="Ver informe"
                      className="size-10 rounded-full p-0"
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/app/seguimientos/${row.id}/informe`)
                      }}
                      style={{ color: 'var(--color-primary)' }}
                      title="Ver informe"
                      type="button"
                      variant="outline"
                    >
                      <span aria-hidden="true" className="text-lg leading-none">
                        👁
                      </span>
                      <span className="sr-only">Ver informe</span>
                    </Button>
                    <Button
                      aria-label={form.id === row.id ? 'Editando' : 'Editar'}
                      className="size-10 rounded-full p-0"
                      onClick={(event) => {
                        event.stopPropagation()
                        selectFollowUpForEdit(row)
                      }}
                      style={{ color: 'var(--color-primary)' }}
                      title={form.id === row.id ? 'Editando' : 'Editar'}
                      type="button"
                      variant="outline"
                    >
                      <span aria-hidden="true" className="text-lg leading-none">
                        ✎
                      </span>
                      <span className="sr-only">{form.id === row.id ? 'Editando' : 'Editar'}</span>
                    </Button>
                    <Button
                      aria-label="Borrar"
                      className="size-10 rounded-full p-0 text-[#8b4b3d] hover:bg-[rgba(217,140,122,0.12)]"
                      onClick={(event) => {
                        event.stopPropagation()
                        openDeleteModal(row)
                      }}
                      title="Borrar"
                      type="button"
                      variant="ghost"
                    >
                      <span aria-hidden="true" className="text-lg leading-none">
                        🗑
                      </span>
                      <span className="sr-only">Borrar</span>
                    </Button>
                  </div>
                ),
              },
            ]}
            getRowClassName={(row) =>
              form.id === row.id ? 'bg-[rgba(47,93,115,0.06)] ring-1 ring-inset ring-[rgba(47,93,115,0.12)]' : ''
            }
            onRowClick={selectFollowUpForEdit}
            rows={followUps}
          />
        </div>
      </PanelCard>

      <ConfirmDeleteModal
        key={`${deleteTarget?.id ?? 'empty'}-${isDeleteModalOpen ? 'open' : 'closed'}`}
        description={`Vas a eliminar este informe de seguimiento${deleteTarget ? ` de ${deleteTarget.child.firstName} ${deleteTarget.child.lastName}` : ''}. Esta acción no se puede deshacer.`}
        error={deleteError}
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen && Boolean(deleteTarget)}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        subjectMeta={
          deleteTarget
            ? `${formatDate(deleteTarget.followUpDate ?? deleteTarget.session?.startsAt ?? deleteTarget.createdAt)} · ${deleteTarget.summary || deleteTarget.title || 'Informe sin resumen'}`
            : ''
        }
        subjectName={deleteTarget?.title || deleteTarget?.summary || 'Informe de seguimiento'}
        title="Eliminar seguimiento"
      />
    </div>
  )
}

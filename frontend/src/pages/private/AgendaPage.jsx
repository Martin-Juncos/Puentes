import { useEffect, useMemo, useRef, useState } from 'react'

import { PageHeader } from '@/components/private/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { InlineLoader } from '@/components/ui/InlineLoader'
import { PanelCard } from '@/components/ui/PanelCard'
import { SuccessFeedbackModal } from '@/components/ui/SuccessFeedbackModal'
import { AgendaManagementPanel } from '@/features/calendar/AgendaManagementPanel'
import { AgendaSessionsTable } from '@/features/calendar/AgendaSessionsTable'
import { RoleCalendar } from '@/features/calendar/RoleCalendar'
import {
  MANAGEMENT_ROLES,
  buildSessionPayload,
  buildUpdateForm,
  createInitial,
  getSessionScheduleLabel,
  getSessionTitle,
  successModalInitial,
  toDateTimeLocalValue,
  updateInitial,
} from '@/features/calendar/sessionAgendaUtils'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { childrenService } from '@/services/childrenService'
import { professionalsService } from '@/services/professionalsService'
import { servicesService } from '@/services/servicesService'
import { sessionsService } from '@/services/sessionsService'
import { formatDateTime } from '@/utils/formatters'

export const AgendaPage = () => {
  const { user } = useAuth()
  const canManageAllAgenda = MANAGEMENT_ROLES.includes(user.role)
  const canManageOwnAgenda = user.role === 'PROFESSIONAL'
  const canManageAgenda = canManageAllAgenda || canManageOwnAgenda
  const ownProfessionalProfile = user.professionalProfile ?? null
  const ownProfessionalOption = ownProfessionalProfile
    ? [
        {
          id: ownProfessionalProfile.id,
          discipline: ownProfessionalProfile.discipline,
          user: {
            fullName: user.fullName,
          },
        },
      ]
    : []
  const createFormBase = {
    ...createInitial,
    professionalId: canManageOwnAgenda ? ownProfessionalProfile?.id ?? '' : '',
  }

  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [createForm, setCreateForm] = useState(createFormBase)
  const [updateForm, setUpdateForm] = useState(updateInitial)
  const [createError, setCreateError] = useState('')
  const [updateError, setUpdateError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteErrorDetails, setDeleteErrorDetails] = useState(null)
  const [deleteStatusNotice, setDeleteStatusNotice] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false)
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [resolutionActionKey, setResolutionActionKey] = useState('')
  const [successModal, setSuccessModal] = useState(successModalInitial)
  const [createPrefillMessage, setCreatePrefillMessage] = useState('')
  const createPanelRef = useRef(null)
  const createStartInputRef = useRef(null)

  const {
    data: sessions,
    isLoading: isSessionsLoading,
    error: sessionsError,
    reload,
  } = useAsyncData(() => sessionsService.list(), [])
  const {
    data: children,
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useAsyncData(() => (canManageAgenda ? childrenService.list() : Promise.resolve([])), [canManageAgenda])
  const {
    data: professionals,
    isLoading: isProfessionalsLoading,
    error: professionalsError,
  } = useAsyncData(
    () => (canManageAllAgenda ? professionalsService.listManage() : Promise.resolve([])),
    [canManageAllAgenda],
  )
  const {
    data: services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useAsyncData(() => (canManageAgenda ? servicesService.listManage() : Promise.resolve([])), [canManageAgenda])

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [selectedSessionId, sessions],
  )
  const availableProfessionals = canManageAllAgenda ? professionals : ownProfessionalOption
  const loadError =
    sessionsError ?? (canManageAgenda ? childrenError ?? professionalsError ?? servicesError : null)
  const isBootstrapping =
    (isSessionsLoading && !sessions.length) ||
    (canManageAgenda &&
      ((isChildrenLoading && !children.length) ||
        (canManageAllAgenda && isProfessionalsLoading && !professionals.length) ||
        (isServicesLoading && !services.length)))

  useEffect(() => {
    if (!sessions.length) {
      setSelectedSessionId('')

      if (canManageAgenda) {
        setUpdateForm(updateInitial)
      }

      return
    }

    const activeSelection = sessions.find((session) => session.id === selectedSessionId)

    if (activeSelection) {
      if (canManageAgenda) {
        setUpdateForm(buildUpdateForm(activeSelection))
      }

      return
    }

    if (canManageOwnAgenda && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id)
    }
  }, [canManageAgenda, canManageOwnAgenda, selectedSessionId, sessions])

  useEffect(() => {
    if (!canManageOwnAgenda || !ownProfessionalProfile?.id) {
      return
    }

    setCreateForm((current) =>
      current.professionalId === ownProfessionalProfile.id
        ? current
        : {
            ...current,
            professionalId: ownProfessionalProfile.id,
          },
    )
  }, [canManageOwnAgenda, ownProfessionalProfile?.id])

  const getServiceDurationValue = (serviceId) => {
    const service = services.find((item) => item.id === serviceId)

    return service?.durationMinutes ? String(service.durationMinutes) : ''
  }

  const updateCreateField = (field) => (event) =>
    setCreateForm((current) => {
      const value = event.target.value

      if (field === 'serviceId') {
        return {
          ...current,
          serviceId: value,
          durationMinutes: getServiceDurationValue(value),
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })

  const updateUpdateField = (field) => (event) =>
    setUpdateForm((current) => {
      const value = event.target.value

      if (field === 'serviceId') {
        return {
          ...current,
          serviceId: value,
          durationMinutes: getServiceDurationValue(value),
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })

  const clearDeleteFeedback = () => {
    setDeleteError('')
    setDeleteErrorDetails(null)
    setDeleteStatusNotice(null)
  }

  const closeSuccessModal = () => {
    setSuccessModal(successModalInitial)
  }

  const clearUpdateSelection = () => {
    setSelectedSessionId('')
    setUpdateForm(updateInitial)
    setUpdateError('')
    clearDeleteFeedback()
  }

  const selectSession = (session) => {
    setSelectedSessionId(session.id)
    setCreatePrefillMessage('')

    if (canManageAgenda) {
      setUpdateForm(buildUpdateForm(session))
      setUpdateError('')
      clearDeleteFeedback()
    }
  }

  const handleSlotSelection = ({ start }) => {
    if (!canManageAgenda) {
      return
    }

    clearUpdateSelection()
    setCreatePrefillMessage(`Nueva sesión preseleccionada para ${formatDateTime(start)}.`)
    setCreateForm((current) => ({
      ...current,
      startsAt: toDateTimeLocalValue(start),
    }))
    setCreateError('')

    window.requestAnimationFrame(() => {
      createPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      window.setTimeout(() => {
        createStartInputRef.current?.focus()
      }, 180)
    })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setIsSubmittingCreate(true)

    try {
      const createdSession = await sessionsService.create(buildSessionPayload(createForm))

      setCreateError('')
      setCreatePrefillMessage('')
      setCreateForm(createFormBase)
      setSelectedSessionId(createdSession.id)
      setUpdateForm(buildUpdateForm(createdSession))
      await reload()
      setSuccessModal({
        isOpen: true,
        title: 'Sesión creada',
        description: 'La sesión ya quedó disponible en el calendario operativo.',
      })
    } catch (error) {
      setCreateError(error.message)
    } finally {
      setIsSubmittingCreate(false)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()

    if (!updateForm.id) {
      return
    }

    setIsSubmittingUpdate(true)

    try {
      const updatedSession = await sessionsService.update(
        updateForm.id,
        buildSessionPayload(updateForm, { includeStatus: true }),
      )

      setSelectedSessionId(updatedSession.id)
      setUpdateForm(buildUpdateForm(updatedSession))
      setUpdateError('')
      clearDeleteFeedback()
      await reload()
      setSuccessModal({
        isOpen: true,
        title: 'Sesión actualizada',
        description: 'Los cambios ya impactan en la agenda compartida.',
      })
    } catch (error) {
      setUpdateError(error.message)
    } finally {
      setIsSubmittingUpdate(false)
    }
  }

  const handleSelectionChange = (event) => {
    const nextSession = sessions.find((session) => session.id === event.target.value)

    if (!nextSession) {
      clearUpdateSelection()
      return
    }

    selectSession(nextSession)
  }

  const closeDeleteModal = () => {
    if (isDeleting) {
      return
    }

    clearDeleteFeedback()
    setIsDeleteModalOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedSession) {
      return
    }

    try {
      setIsDeleting(true)
      await sessionsService.remove(selectedSession.id)
      setIsDeleteModalOpen(false)
      clearUpdateSelection()
      await reload()
      setSuccessModal({
        isOpen: true,
        title: 'Sesión eliminada',
        description: 'La sesión se eliminó de la agenda porque no tenía historial asociado.',
      })
    } catch (error) {
      setDeleteError(error.message)
      setDeleteErrorDetails(error.details ?? null)
      setDeleteStatusNotice(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelSession = async () => {
    if (!selectedSession) {
      return
    }

    try {
      setResolutionActionKey('cancel-session')
      const canceledSession = await sessionsService.update(selectedSession.id, {
        status: 'CANCELED',
      })

      setSelectedSessionId(canceledSession.id)
      setUpdateForm(buildUpdateForm(canceledSession))
      setUpdateError('')
      setDeleteError('')
      setDeleteErrorDetails(null)
      setDeleteStatusNotice({
        title: 'Sesión cancelada',
        description: 'La sesión se conservó por trazabilidad, pero ya no figura como activa en la agenda.',
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
          key: 'cancel-session',
          label:
            resolutionActionKey === 'cancel-session'
              ? 'Cancelando sesión...'
              : selectedSession?.status === 'CANCELED'
                ? 'La sesión ya está cancelada'
                : 'Cancelar sesión',
          onClick: handleCancelSession,
          disabled: Boolean(resolutionActionKey) || selectedSession?.status === 'CANCELED',
        },
      ]
    : []

  if (isBootstrapping) {
    return (
      <PanelCard className="flex min-h-64 items-center justify-center" variant="form">
        <InlineLoader
          label={canManageAgenda ? 'Cargando agenda y catálogos operativos...' : 'Cargando tus sesiones...'}
        />
      </PanelCard>
    )
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description={
          canManageAllAgenda
            ? 'Administración, coordinación y secretaría pueden gestionar toda la agenda institucional desde el mismo calendario.'
            : 'Como profesional, acá gestionás únicamente tus sesiones asignadas. No ves ni modificás la agenda de otros profesionales.'
        }
        eyebrow="Agenda interna"
        title={canManageAllAgenda ? 'Calendario operativo con gestión completa' : 'Mi agenda profesional'}
      />

      {loadError ? (
        <Alert title="No pudimos cargar toda la agenda" tone="error">
          <p>{loadError.message}</p>
        </Alert>
      ) : null}

      <RoleCalendar
        canSelectSlot={canManageAgenda}
        onSelectSession={selectSession}
        onSelectSlot={handleSlotSelection}
        selectedSessionId={selectedSessionId}
        sessions={sessions}
      />

      <Alert title={canManageAllAgenda ? 'Cómo usar esta agenda' : 'Cómo gestionar tu agenda'} tone="info">
        <p>
          {canManageAllAgenda
            ? 'Seleccioná una sesión del calendario o del listado para editarla. También podés hacer clic en un bloque vacío del calendario para precargar la fecha y hora de una nueva sesión.'
            : 'Podés crear, editar, cancelar y eliminar solo tus propias sesiones. El calendario y el listado nunca incluyen eventos de otros profesionales.'}
        </p>
      </Alert>

      {canManageAgenda ? (
        <>
          <AgendaManagementPanel
            children={children}
            createPanelRef={createPanelRef}
            createDescription={
              canManageAllAgenda
                ? undefined
                : 'Definí niño o niña, servicio, horario de inicio, duración y notas de trabajo. La sesión se asigna automáticamente a tu perfil profesional.'
            }
            createError={createError}
            createForm={createForm}
            createPrefillMessage={createPrefillMessage}
            createStartInputRef={createStartInputRef}
            disableProfessionalSelection={canManageOwnAgenda}
            isSubmittingCreate={isSubmittingCreate}
            isSubmittingUpdate={isSubmittingUpdate}
            onClearSelection={clearUpdateSelection}
            onCreate={handleCreate}
            onCreateFieldChange={updateCreateField}
            onOpenDeleteModal={() => {
              clearDeleteFeedback()
              setIsDeleteModalOpen(true)
            }}
            onSelectionChange={handleSelectionChange}
            onUpdate={handleUpdate}
            onUpdateFieldChange={updateUpdateField}
            professionalFieldHint={
              canManageOwnAgenda ? 'Tu perfil profesional queda fijo y no puede cambiarse desde esta pantalla.' : undefined
            }
            professionals={availableProfessionals}
            selectedSession={selectedSession}
            services={services}
            sessions={sessions}
            updateDescription={
              canManageAllAgenda
                ? undefined
                : 'Seleccioná una sesión propia para reprogramarla, actualizar notas, cancelarla o eliminarla si todavía no tiene historial.'
            }
            updateError={updateError}
            updateForm={updateForm}
          />

          <AgendaSessionsTable
            canManageAgenda
            description="El listado se sincroniza con el calendario y permite cargar cualquier sesión en el panel de edición."
            onSelectSession={selectSession}
            selectedSessionId={selectedSessionId}
            sessions={sessions}
            title="Sesiones registradas"
          />
        </>
      ) : (
        <AgendaSessionsTable
          canManageAgenda={false}
          description="Podés seleccionar cualquier sesión del listado para revisar su detalle en la tarjeta lateral."
          onSelectSession={selectSession}
          selectedSessionId={selectedSessionId}
          sessions={sessions}
          title="Mis sesiones"
        />
      )}

      <ConfirmDeleteModal
        key={`${selectedSession?.id ?? 'empty'}-${isDeleteModalOpen ? 'open' : 'closed'}`}
        description={`Vas a eliminar la sesión de ${selectedSession ? getSessionTitle(selectedSession) : ''}. Si tiene asistencia, seguimientos o cobros asociados, el sistema bloqueará la acción y te ofrecerá cancelarla en su lugar.`}
        error={deleteError}
        errorDetails={deleteErrorDetails}
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen && Boolean(selectedSession)}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        resolutionActions={deleteResolutionActions}
        statusNotice={deleteStatusNotice}
        subjectMeta={
          selectedSession
            ? `${selectedSession.service.name} · ${getSessionScheduleLabel(selectedSession)}`
            : ''
        }
        subjectName={selectedSession ? getSessionTitle(selectedSession) : ''}
        title="Eliminar sesión"
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

import { useEffect, useMemo, useState } from 'react'
import { FiAlertCircle, FiArrowRight, FiBell, FiClock, FiMessageSquare, FiPlus, FiSend, FiUsers } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { ROLE_LABELS } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { useAsyncData } from '@/hooks/useAsyncData'
import { usePolling } from '@/hooks/usePolling'
import { childrenService } from '@/services/childrenService'
import { messagesService } from '@/services/messagesService'
import { formatDateTime } from '@/utils/formatters'
import { emitNotificationsSync, PANEL_NOTIFICATIONS_SYNC_EVENT } from '@/utils/panelEvents'

const filterOptions = [
  { value: 'ALL', label: 'Todos' },
  { value: 'UNREAD', label: 'No leídos' },
  { value: 'HIGH', label: 'Alta prioridad' },
]

const generalContextOptions = [
  { value: 'CONSULTA', label: 'Consulta' },
  { value: 'REPORTE', label: 'Reporte' },
  { value: 'INFORMACION', label: 'InformaciÃ³n' },
]

const buildComposeInitial = ({ childId = '', contextType = '' } = {}) => ({
  childId,
  contextType,
  subject: '',
  priority: 'NORMAL',
  participantUserIds: [],
  initialMessage: '',
})

const buildSearchParamsState = ({ childId = '', compose = false, threadId = '' }) => {
  const next = new URLSearchParams()

  if (childId) {
    next.set('childId', childId)
  }

  if (threadId) {
    next.set('threadId', threadId)
  }

  if (compose) {
    next.set('compose', '1')
  }

  return next
}

const recipientDescriptor = (recipient) => {
  if (recipient.role === 'PROFESSIONAL') {
    return `${recipient.fullName} · ${recipient.professionalProfile?.discipline ?? 'Profesional'}`
  }

  return `${recipient.fullName} · ${ROLE_LABELS[recipient.role]}`
}

const getThreadContextLabel = (thread) =>
  thread.context?.label ??
  (thread.child ? `${thread.child.firstName} ${thread.child.lastName}` : 'General')

const buildComposeContextValue = (composeForm) => {
  if (composeForm.contextType) {
    return `general:${composeForm.contextType}`
  }

  if (composeForm.childId) {
    return `child:${composeForm.childId}`
  }

  return ''
}

const parseComposeContextValue = (value) => {
  if (!value) {
    return { childId: '', contextType: '' }
  }

  if (value.startsWith('general:')) {
    return {
      childId: '',
      contextType: value.replace('general:', ''),
    }
  }

  return {
    childId: value.replace('child:', ''),
    contextType: '',
  }
}

export const MessagesPage = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const childIdFromUrl = searchParams.get('childId') ?? ''
  const threadIdFromUrl = searchParams.get('threadId') ?? ''
  const composeFromUrl = searchParams.get('compose') === '1'

  const [threads, setThreads] = useState([])
  const [isThreadsLoading, setIsThreadsLoading] = useState(true)
  const [threadsError, setThreadsError] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [activeThreadId, setActiveThreadId] = useState(threadIdFromUrl)
  const [activeThread, setActiveThread] = useState(null)
  const [isThreadLoading, setIsThreadLoading] = useState(false)
  const [threadError, setThreadError] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [replyError, setReplyError] = useState('')
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [isComposeOpen, setIsComposeOpen] = useState(composeFromUrl)
  const [composeForm, setComposeForm] = useState(buildComposeInitial({ childId: childIdFromUrl }))
  const [composeRecipients, setComposeRecipients] = useState([])
  const [isRecipientsLoading, setIsRecipientsLoading] = useState(false)
  const [composeError, setComposeError] = useState('')
  const [isCreatingThread, setIsCreatingThread] = useState(false)

  const { data: children } = useAsyncData(() => childrenService.list(), [])

  const visibleThreads = useMemo(() => {
    if (activeFilter === 'UNREAD') {
      return threads.filter((thread) => thread.unreadCount > 0)
    }

    if (activeFilter === 'HIGH') {
      return threads.filter((thread) => thread.priority === 'HIGH')
    }

    return threads
  }, [activeFilter, threads])

  const updateRouteState = ({ childId = childIdFromUrl, compose = false, threadId = '' }) => {
    setSearchParams(buildSearchParamsState({ childId, compose, threadId }), { replace: true })
  }

  const loadThreads = async ({ silent = false } = {}) => {
    if (!silent) {
      setIsThreadsLoading(true)
    }

    try {
      const nextThreads = await messagesService.list(childIdFromUrl ? { childId: childIdFromUrl } : {})
      setThreads(nextThreads)
      setThreadsError('')
    } catch (error) {
      setThreadsError(error.message)
    } finally {
      if (!silent) {
        setIsThreadsLoading(false)
      }
    }
  }

  const loadActiveThread = async (threadId, { silent = false } = {}) => {
    if (!threadId) {
      setActiveThread(null)
      return
    }

    if (!silent) {
      setIsThreadLoading(true)
    }

    try {
      const thread = await messagesService.getById(threadId)
      setActiveThread(thread)
      setThreadError('')

      if (thread.unreadCount > 0) {
        await messagesService.markAsRead(threadId)
        setActiveThread((current) => (current?.id === threadId ? { ...current, unreadCount: 0 } : current))
        setThreads((current) =>
          current.map((item) => (item.id === threadId ? { ...item, unreadCount: 0 } : item)),
        )
        emitNotificationsSync()
      }
    } catch (error) {
      setThreadError(error.message)
    } finally {
      if (!silent) {
        setIsThreadLoading(false)
      }
    }
  }

  useEffect(() => {
    setIsComposeOpen(composeFromUrl)
    setActiveThreadId(threadIdFromUrl)

    if (composeFromUrl) {
      setComposeForm((current) => ({
        ...current,
        childId: childIdFromUrl || current.childId,
        contextType: childIdFromUrl ? '' : current.contextType,
      }))
    }
  }, [childIdFromUrl, composeFromUrl, threadIdFromUrl])

  useEffect(() => {
    void loadThreads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childIdFromUrl])

  useEffect(() => {
    if (isComposeOpen || activeThreadId || isThreadsLoading || !threads.length) {
      return
    }

    const nextThreadId = threads[0].id
    setActiveThreadId(nextThreadId)
    updateRouteState({ childId: childIdFromUrl, threadId: nextThreadId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, childIdFromUrl, isComposeOpen, isThreadsLoading, threads])

  useEffect(() => {
    if (!activeThreadId || isComposeOpen) {
      return
    }

    void loadActiveThread(activeThreadId)
  }, [activeThreadId, isComposeOpen])

  useEffect(() => {
    if (!isComposeOpen || (!composeForm.childId && !composeForm.contextType)) {
      setComposeRecipients([])
      return
    }

    let isActive = true

    const loadRecipients = async () => {
      setIsRecipientsLoading(true)

      try {
        const recipients = await messagesService.listRecipients({
          childId: composeForm.childId,
          contextType: composeForm.contextType,
        })

        if (!isActive) {
          return
        }

        setComposeRecipients(recipients)
        setComposeError('')
        setComposeForm((current) => ({
          ...current,
          participantUserIds: current.participantUserIds.filter((participantId) =>
            recipients.some((recipient) => recipient.id === participantId),
          ),
        }))
      } catch (error) {
        if (!isActive) {
          return
        }

        setComposeError(error.message)
        setComposeRecipients([])
      } finally {
        if (isActive) {
          setIsRecipientsLoading(false)
        }
      }
    }

    void loadRecipients()

    return () => {
      isActive = false
    }
  }, [composeForm.childId, composeForm.contextType, isComposeOpen])

  useEffect(() => {
    const handleSync = () => {
      void loadThreads({ silent: true })

      if (activeThreadId && !isComposeOpen) {
        void loadActiveThread(activeThreadId, { silent: true })
      }
    }

    window.addEventListener(PANEL_NOTIFICATIONS_SYNC_EVENT, handleSync)

    return () => {
      window.removeEventListener(PANEL_NOTIFICATIONS_SYNC_EVENT, handleSync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, isComposeOpen, childIdFromUrl])

  usePolling(
    () => loadThreads({ silent: true }),
    {
      enabled: true,
      intervalMs: 30000,
    },
  )

  usePolling(
    () => {
      if (!activeThreadId || isComposeOpen) {
        return undefined
      }

      return loadActiveThread(activeThreadId, { silent: true })
    },
    {
      enabled: Boolean(activeThreadId) && !isComposeOpen,
      intervalMs: 15000,
    },
  )

  const openThread = (threadId) => {
    setIsComposeOpen(false)
    setActiveThreadId(threadId)
    updateRouteState({ childId: childIdFromUrl, threadId })
  }

  const openCompose = (childId = childIdFromUrl) => {
    setActiveThreadId('')
    setActiveThread(null)
    setThreadError('')
    setComposeForm(buildComposeInitial({ childId }))
    setComposeRecipients([])
    setComposeError('')
    setIsComposeOpen(true)
    updateRouteState({ childId, compose: true })
  }

  const closeCompose = () => {
    setComposeError('')
    setComposeRecipients([])
    setIsComposeOpen(false)

    if (activeThreadId) {
      updateRouteState({ childId: childIdFromUrl, threadId: activeThreadId })
      return
    }

    updateRouteState({ childId: childIdFromUrl })
  }

  const toggleRecipient = (recipientId) => {
    setComposeForm((current) => ({
      ...current,
      participantUserIds: current.participantUserIds.includes(recipientId)
        ? current.participantUserIds.filter((item) => item !== recipientId)
        : [...current.participantUserIds, recipientId],
    }))
  }

  const handleComposeField = (field) => (event) =>
    setComposeForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleComposeContextChange = (event) => {
    const nextContext = parseComposeContextValue(event.target.value)

    setComposeForm((current) => ({
      ...current,
      ...nextContext,
      participantUserIds: [],
    }))
  }

  const handleCreateThread = async (event) => {
    event.preventDefault()
    setIsCreatingThread(true)

    try {
      const thread = await messagesService.create(composeForm)
      const nextChildId = thread.child?.id ?? ''

      setActiveThread(thread)
      setActiveThreadId(thread.id)
      setComposeError('')
      setComposeForm(buildComposeInitial({ childId: nextChildId }))
      setComposeRecipients([])
      setIsComposeOpen(false)
      updateRouteState({ childId: nextChildId, threadId: thread.id })
      await loadThreads({ silent: true })
      emitNotificationsSync()
    } catch (error) {
      setComposeError(error.message)
    } finally {
      setIsCreatingThread(false)
    }
  }

  const handleReplySubmit = async (event) => {
    event.preventDefault()

    if (!activeThreadId) {
      return
    }

    setIsSendingReply(true)

    try {
      const updatedThread = await messagesService.createMessage(activeThreadId, { body: replyBody })
      setActiveThread(updatedThread)
      setReplyBody('')
      setReplyError('')
      await loadThreads({ silent: true })
      emitNotificationsSync()
    } catch (error) {
      setReplyError(error.message)
    } finally {
      setIsSendingReply(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <PanelCard className="h-fit">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">Mensajes</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">Inbox interno</h2>
            <p className="mt-2 text-sm leading-6 text-[rgba(46,46,46,0.68)]">
              Conversaciones operativas asociadas a cada niño o niña, o a gestiones generales del equipo.
            </p>
          </div>

          <Button className="gap-2 px-4 py-2" onClick={() => openCompose()} type="button">
            <FiPlus aria-hidden="true" className="size-4" />
            Nuevo
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              className="px-3 py-2 text-xs"
              onClick={() => setActiveFilter(option.value)}
              type="button"
              variant={activeFilter === option.value ? 'primary' : 'outline'}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="mt-5 rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
          {threads.length} hilos cargados
        </div>

        {threadsError ? (
          <div className="mt-5 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{threadsError}</div>
        ) : null}

        {isThreadsLoading ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-6 text-sm text-[rgba(46,46,46,0.64)]">
            Cargando conversaciones...
          </div>
        ) : null}

        {!isThreadsLoading && !visibleThreads.length ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-6 text-sm text-[rgba(46,46,46,0.64)]">
            No hay conversaciones para el filtro seleccionado.
          </div>
        ) : null}

        {!isThreadsLoading && visibleThreads.length ? (
          <div className="mt-5 grid gap-3">
            {visibleThreads.map((thread) => (
              <button
                key={thread.id}
                className={`rounded-3xl border px-4 py-4 text-left transition-colors ${
                  activeThreadId === thread.id && !isComposeOpen
                    ? 'border-[rgba(47,93,115,0.22)] bg-[rgba(47,93,115,0.07)]'
                    : 'border-[rgba(47,93,115,0.1)] bg-white hover:bg-[rgba(47,93,115,0.04)]'
                }`}
                onClick={() => openThread(thread.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">{thread.subject}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[rgba(47,93,115,0.62)]">
                      {getThreadContextLabel(thread)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {thread.priority === 'HIGH' ? (
                      <span className="rounded-full bg-[rgba(217,140,122,0.16)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b4b3d]">
                        Alta
                      </span>
                    ) : null}
                    {thread.unreadCount > 0 ? (
                      <span className="rounded-full bg-[rgba(47,93,115,0.14)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                        {thread.unreadCount} nuevas
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-[rgba(46,46,46,0.74)]">{thread.lastMessagePreview}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[rgba(47,93,115,0.66)]">
                  <span className="inline-flex items-center gap-1">
                    <FiClock aria-hidden="true" className="size-3.5" />
                    {formatDateTime(thread.lastMessageAt)}
                  </span>
                  {thread.lastMessageAuthor ? <span>{thread.lastMessageAuthor.fullName}</span> : null}
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </PanelCard>

      <PanelCard>
        {isComposeOpen ? (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">Nuevo mensaje</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">Crear conversación</h2>
                <p className="mt-2 text-sm leading-6 text-[rgba(46,46,46,0.68)]">
                  Podés iniciar un hilo sobre un alumno o una gestión general. Vos quedás incluido automáticamente.
                </p>
              </div>
              <Button className="px-4 py-2" onClick={closeCompose} type="button" variant="ghost">
                Cancelar
              </Button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleCreateThread}>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Caso">
                  <select
                    className="field-input"
                    onChange={handleComposeContextChange}
                    required
                    value={buildComposeContextValue(composeForm)}
                  >
                    <option value="">Seleccionar tipo o alumno</option>
                    {generalContextOptions.map((option) => (
                      <option key={option.value} value={`general:${option.value}`}>
                        {option.label}
                      </option>
                    ))}
                    {children.map((child) => (
                      <option key={child.id} value={`child:${child.id}`}>
                        {child.firstName} {child.lastName}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Prioridad">
                  <select className="field-input" onChange={handleComposeField('priority')} value={composeForm.priority}>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </Field>
              </div>

              <Field label="Asunto">
                <input className="field-input" onChange={handleComposeField('subject')} required value={composeForm.subject} />
              </Field>

              <div className="rounded-3xl border border-[rgba(47,93,115,0.1)] bg-[rgba(47,93,115,0.03)] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary)]">Destinatarios</p>
                    <p className="mt-1 text-sm text-[rgba(46,46,46,0.66)]">
                      Seleccioná quiénes deben recibir la conversación. Vos quedás agregado automáticamente.
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    {composeForm.participantUserIds.length} elegidos
                  </div>
                </div>

                {isRecipientsLoading ? (
                  <div className="mt-4 text-sm text-[rgba(46,46,46,0.66)]">Cargando destinatarios disponibles...</div>
                ) : null}

                {!isRecipientsLoading && (composeForm.childId || composeForm.contextType) && !composeRecipients.length ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-[rgba(47,93,115,0.16)] px-4 py-4 text-sm text-[rgba(46,46,46,0.64)]">
                    {composeForm.childId
                      ? 'No hay otros usuarios disponibles para este caso.'
                      : 'No hay otros usuarios disponibles para este tipo de conversación.'}
                  </div>
                ) : null}

                {!isRecipientsLoading && composeRecipients.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {composeRecipients.map((recipient) => (
                      <label
                        key={recipient.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                          composeForm.participantUserIds.includes(recipient.id)
                            ? 'border-[rgba(47,93,115,0.22)] bg-white'
                            : 'border-[rgba(47,93,115,0.1)] bg-[rgba(255,255,255,0.72)]'
                        }`}
                      >
                        <input
                          checked={composeForm.participantUserIds.includes(recipient.id)}
                          className="mt-1"
                          onChange={() => toggleRecipient(recipient.id)}
                          type="checkbox"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[var(--color-primary)]">{recipient.fullName}</span>
                          <span className="mt-1 block text-sm leading-6 text-[rgba(46,46,46,0.68)]">
                            {recipientDescriptor(recipient)}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>

              <Field label="Mensaje inicial">
                <textarea
                  className="field-input min-h-44"
                  onChange={handleComposeField('initialMessage')}
                  required
                  value={composeForm.initialMessage}
                />
              </Field>

              {composeError ? (
                <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{composeError}</div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="rounded-2xl bg-[rgba(47,93,115,0.05)] px-4 py-3 text-sm text-[rgba(46,46,46,0.68)]">
                  Las respuestas futuras notificarán automáticamente a los demás participantes del hilo.
                </div>
                <Button className="gap-2" disabled={isCreatingThread} type="submit">
                  <FiSend aria-hidden="true" className="size-4" />
                  {isCreatingThread ? 'Creando hilo...' : 'Crear conversación'}
                </Button>
              </div>
            </form>
          </div>
        ) : activeThread ? (
          <div>
            <div className="flex flex-col gap-4 border-b border-[rgba(47,93,115,0.1)] pb-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[rgba(47,93,115,0.58)]">Conversación activa</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{activeThread.subject}</h2>
                  <p className="mt-2 text-sm leading-6 text-[rgba(46,46,46,0.68)]">
                    Contexto: {getThreadContextLabel(activeThread)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {activeThread.priority === 'HIGH' ? (
                    <span className="rounded-full bg-[rgba(217,140,122,0.16)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b4b3d]">
                      Alta prioridad
                    </span>
                  ) : null}
                  <span className="rounded-full bg-[rgba(47,93,115,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                    {activeThread.participants.length} participantes
                  </span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {activeThread.participants.map((participant) => (
                  <div key={participant.id} className="rounded-2xl bg-[rgba(47,93,115,0.04)] px-4 py-3">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">
                      {participant.user.fullName}
                      {participant.user.id === user.id ? ' · Vos' : ''}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[rgba(47,93,115,0.62)]">
                      {ROLE_LABELS[participant.user.role]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {threadError ? (
              <div className="mt-5 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{threadError}</div>
            ) : null}

            {isThreadLoading ? (
              <div className="mt-5 rounded-2xl border border-dashed border-[rgba(47,93,115,0.18)] px-4 py-6 text-sm text-[rgba(46,46,46,0.64)]">
                Cargando conversación...
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {activeThread.messages.map((message) => {
                  const isOwnMessage = message.authorUser.id === user.id

                  return (
                    <article
                      key={message.id}
                      className={`max-w-3xl rounded-3xl px-5 py-4 ${
                        isOwnMessage
                          ? 'ml-auto bg-[var(--color-primary)] text-white'
                          : 'border border-[rgba(47,93,115,0.1)] bg-white text-[var(--color-text)]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em]">
                        <span className={isOwnMessage ? 'text-white/82' : 'text-[rgba(47,93,115,0.62)]'}>
                          {message.authorUser.fullName}
                        </span>
                        <span className={isOwnMessage ? 'text-white/76' : 'text-[rgba(47,93,115,0.54)]'}>
                          {ROLE_LABELS[message.authorUser.role]}
                        </span>
                      </div>
                      <p className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${isOwnMessage ? 'text-white' : 'text-[rgba(46,46,46,0.82)]'}`}>
                        {message.body}
                      </p>
                      <div className={`mt-3 text-xs ${isOwnMessage ? 'text-white/76' : 'text-[rgba(47,93,115,0.58)]'}`}>
                        {formatDateTime(message.createdAt)}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            <form className="mt-6 border-t border-[rgba(47,93,115,0.1)] pt-5" onSubmit={handleReplySubmit}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)]">Responder</p>
                  <p className="mt-1 text-sm text-[rgba(46,46,46,0.66)]">
                    Todos los demás participantes recibirán una alerta interna al enviar el mensaje.
                  </p>
                </div>
                <div className="rounded-full bg-[rgba(47,93,115,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  {replyBody.trim().length} caracteres
                </div>
              </div>

              <textarea
                className="field-input mt-4 min-h-36"
                onChange={(event) => setReplyBody(event.target.value)}
                placeholder="Escribí una respuesta para el equipo..."
                required
                value={replyBody}
              />

              {replyError ? (
                <div className="mt-4 rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{replyError}</div>
              ) : null}

              <div className="mt-4 flex justify-end">
                <Button className="gap-2" disabled={isSendingReply} type="submit">
                  <FiSend aria-hidden="true" className="size-4" />
                  {isSendingReply ? 'Enviando...' : 'Enviar respuesta'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-3xl border border-dashed border-[rgba(47,93,115,0.18)] bg-[rgba(47,93,115,0.03)] px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-white text-[var(--color-primary)]">
              <FiMessageSquare aria-hidden="true" className="size-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-[var(--color-primary)]">Sin conversación seleccionada</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[rgba(46,46,46,0.68)]">
              Elegí un hilo del listado o iniciá uno nuevo para coordinar acciones sobre un caso o una gestión general.
            </p>
            <Button className="mt-5 gap-2" onClick={() => openCompose()} type="button">
              <FiPlus aria-hidden="true" className="size-4" />
              Nuevo mensaje
            </Button>
          </div>
        )}

        <div className="mt-6 grid gap-4 rounded-3xl bg-[rgba(47,93,115,0.04)] p-5 lg:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <FiBell aria-hidden="true" className="size-4" />
              <span className="text-sm font-semibold">Notificaciones</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[rgba(46,46,46,0.66)]">
              Se actualizan automáticamente y también cuando recuperás foco en la ventana.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <FiUsers aria-hidden="true" className="size-4" />
              <span className="text-sm font-semibold">Participantes</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[rgba(46,46,46,0.66)]">
              Solo intervienen secretaría, coordinación y profesionales habilitados para ese contexto.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4">
            <div className="flex items-center gap-2 text-[var(--color-primary)]">
              <FiArrowRight aria-hidden="true" className="size-4" />
              <span className="text-sm font-semibold">Contexto ordenado</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[rgba(46,46,46,0.66)]">
              Cada hilo puede quedar atado a un alumno o a una categoría general para mantener el intercambio ordenado.
            </p>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[rgba(217,140,122,0.12)] px-4 py-3 text-sm text-[#8b4b3d]">
            <span className="inline-flex items-center gap-2">
              <FiAlertCircle aria-hidden="true" className="size-4" />
              No hay alumnos disponibles, pero igual podés iniciar hilos de Consulta, Reporte o Información.
            </span>
          </div>
        ) : null}
      </PanelCard>
    </div>
  )
}

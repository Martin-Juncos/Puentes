import { createElement } from 'react'

import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDateTime } from '@/utils/formatters'

export const MANAGEMENT_ROLES = ['ADMIN', 'COORDINATION', 'SECRETARY']

export const sessionStatusLabels = {
  SCHEDULED: 'Programada',
  COMPLETED: 'Completada',
  CANCELED: 'Cancelada',
  RESCHEDULED: 'Reprogramada',
}

const sessionStatusTone = {
  SCHEDULED: 'info',
  COMPLETED: 'success',
  CANCELED: 'neutral',
  RESCHEDULED: 'warning',
}

export const createInitial = {
  childId: '',
  professionalId: '',
  serviceId: '',
  startsAt: '',
  durationMinutes: '',
  adminNotes: '',
  internalNotes: '',
}

export const updateInitial = {
  id: '',
  childId: '',
  professionalId: '',
  serviceId: '',
  startsAt: '',
  durationMinutes: '',
  status: 'SCHEDULED',
  adminNotes: '',
  internalNotes: '',
}

export const successModalInitial = {
  isOpen: false,
  title: '',
  description: '',
}

const padDatePart = (value) => String(value).padStart(2, '0')

const parseDateTimeLocalValue = (value) => {
  if (!value || typeof value !== 'string') {
    return undefined
  }

  const [datePart, timePart] = value.split('T')

  if (!datePart || !timePart) {
    return undefined
  }

  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)

  if ([year, month, day, hours, minutes].some((part) => !Number.isInteger(part))) {
    return undefined
  }

  const date = new Date(year, month - 1, day, hours, minutes, 0, 0)

  return Number.isNaN(date.getTime()) ? undefined : date
}

export const toApiDateTimeValue = (value) => {
  const date = parseDateTimeLocalValue(value)

  return date ? date.toISOString() : undefined
}

export const toDateTimeLocalValue = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`
}

export const formatTime = (value) =>
  new Intl.DateTimeFormat('es-AR', {
    timeStyle: 'short',
  }).format(new Date(value))

export const getSessionDurationMinutes = (startsAt, endsAt) => {
  if (!startsAt || !endsAt) {
    return ''
  }

  const durationMs = new Date(endsAt).getTime() - new Date(startsAt).getTime()

  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return ''
  }

  return String(Math.round(durationMs / 60000))
}

export const buildEndsAtValue = (startsAt, durationMinutes) => {
  if (!startsAt || !durationMinutes) {
    return undefined
  }

  const duration = Number(durationMinutes)
  const startsAtDate = parseDateTimeLocalValue(startsAt)

  if (!Number.isFinite(duration) || duration <= 0 || !startsAtDate) {
    return undefined
  }

  return new Date(startsAtDate.getTime() + duration * 60000).toISOString()
}

export const getSessionTitle = (session) => `${session.child.firstName} ${session.child.lastName}`

export const getSessionScheduleLabel = (session) =>
  `${formatDateTime(session.startsAt)} a ${formatTime(session.endsAt)}`

export const buildSessionOptionLabel = (session) =>
  `${formatDateTime(session.startsAt)} · ${getSessionTitle(session)} · ${session.service.name}`

export const buildUpdateForm = (session) => ({
  id: session.id,
  childId: session.child.id,
  professionalId: session.professional.id,
  serviceId: session.service.id,
  startsAt: toDateTimeLocalValue(session.startsAt),
  durationMinutes: getSessionDurationMinutes(session.startsAt, session.endsAt),
  status: session.status,
  adminNotes: session.adminNotes ?? '',
  internalNotes: session.internalNotes ?? '',
})

export const buildSessionPayload = (form, { includeStatus = false } = {}) => ({
  childId: form.childId,
  professionalId: form.professionalId,
  serviceId: form.serviceId,
  startsAt: toApiDateTimeValue(form.startsAt),
  endsAt: buildEndsAtValue(form.startsAt, form.durationMinutes),
  status: includeStatus ? form.status : undefined,
  adminNotes: form.adminNotes,
  internalNotes: form.internalNotes,
})

export const renderSessionStatusBadge = (status) =>
  createElement(
    StatusBadge,
    { tone: sessionStatusTone[status] ?? 'neutral' },
    sessionStatusLabels[status] ?? status,
  )

import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'

import { createSession, listSessions, updateSession } from './repository.js'

const buildSessionWhere = async (filters, user) => {
  const where = {}

  if (filters.childId) {
    where.childId = filters.childId
  }

  if (filters.professionalId) {
    where.professionalId = filters.professionalId
  }

  if (filters.serviceId) {
    where.serviceId = filters.serviceId
  }

  if (filters.status) {
    where.status = filters.status
  }

  if (filters.startDate || filters.endDate) {
    where.startsAt = {}
  }

  if (filters.startDate) {
    where.startsAt.gte = filters.startDate
  }

  if (filters.endDate) {
    where.startsAt.lte = filters.endDate
  }

  if (user.role === 'PROFESSIONAL') {
    where.professionalId = await resolveProfessionalProfileId(user.id)
  }

  return where
}

const ensureSessionDependencies = async ({ childId, professionalId, serviceId }) => {
  const [child, professional, service] = await Promise.all([
    childId
      ? prisma.child.findUnique({ where: { id: childId }, select: { id: true } })
      : Promise.resolve(true),
    professionalId
      ? prisma.professionalProfile.findUnique({ where: { id: professionalId }, select: { id: true } })
      : Promise.resolve(true),
    serviceId
      ? prisma.service.findUnique({
          where: { id: serviceId },
          select: { id: true, durationMinutes: true },
        })
      : Promise.resolve(true),
  ])

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña para la sesión.')
  }

  if (!professional) {
    throw new AppError(404, 'PROFESSIONAL_NOT_FOUND', 'No se encontró el profesional de la sesión.')
  }

  if (!service) {
    throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio de la sesión.')
  }

  return service
}

export const getSessions = async (filters, user) => listSessions(await buildSessionWhere(filters, user))

export const createSessionRecord = async (payload, user) => {
  const service = await ensureSessionDependencies(payload)
  const endsAt =
    payload.endsAt ?? new Date(payload.startsAt.getTime() + service.durationMinutes * 60000)

  return createSession({
    ...payload,
    endsAt,
    createdByUserId: user.id,
  })
}

export const updateSessionRecord = async (id, payload, user) => {
  if (user.role === 'PROFESSIONAL') {
    throw new AppError(
      403,
      'FORBIDDEN',
      'Los profesionales no pueden reprogramar ni editar sesiones desde este endpoint.',
    )
  }

  let service

  if (payload.childId || payload.professionalId || payload.serviceId) {
    service = await ensureSessionDependencies(payload)
  }

  const data = { ...payload }

  if (payload.startsAt && !payload.endsAt && service?.durationMinutes) {
    data.endsAt = new Date(payload.startsAt.getTime() + service.durationMinutes * 60000)
  }

  try {
    return await updateSession(id, data)
  } catch {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión solicitada.')
  }
}

import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'

import {
  createSession,
  deleteSession,
  getSession,
  listSessions,
  updateSession,
} from './repository.js'

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

const getSessionRecord = async (id) => {
  const session = await getSession(id)

  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión solicitada.')
  }

  return session
}

const resolveSessionProfessionalId = async (payload, user, existingSession = null) => {
  if (user.role === 'PROFESSIONAL') {
    return existingSession?.professional.id ?? resolveProfessionalProfileId(user.id)
  }

  return payload.professionalId ?? existingSession?.professional.id
}

const ensureProfessionalChildAccess = async ({ childId, professionalId, user }) => {
  if (user.role !== 'PROFESSIONAL' || !childId || !professionalId) {
    return
  }

  const assignment = await prisma.childProfessionalAssignment.findFirst({
    where: {
      childId,
      professionalId,
    },
    select: {
      id: true,
    },
  })

  if (!assignment) {
    throw new AppError(
      403,
      'SESSION_CHILD_FORBIDDEN',
      'Solo puedes gestionar sesiones de niños o niñas asignados a tu perfil profesional.',
    )
  }
}

const getAccessibleSessionRecord = async (id, user) => {
  const session = await getSessionRecord(id)

  if (user.role !== 'PROFESSIONAL') {
    return session
  }

  const professionalId = await resolveProfessionalProfileId(user.id)

  if (session.professional.id !== professionalId) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión solicitada.')
  }

  return session
}

export const getSessions = async (filters, user) => {
  return listSessions(await buildSessionWhere(filters, user))
}

export const createSessionRecord = async (payload, user) => {
  const professionalId = await resolveSessionProfessionalId(payload, user)

  if (!professionalId) {
    throw new AppError(
      400,
      'PROFESSIONAL_REQUIRED',
      'Debes indicar un profesional para registrar la sesión.',
    )
  }

  await ensureProfessionalChildAccess({
    childId: payload.childId,
    professionalId,
    user,
  })

  const service = await ensureSessionDependencies({
    ...payload,
    professionalId,
  })
  const endsAt =
    payload.endsAt ?? new Date(payload.startsAt.getTime() + service.durationMinutes * 60000)

  return createSession({
    ...payload,
    professionalId,
    endsAt,
    createdByUserId: user.id,
  })
}

export const updateSessionRecord = async (id, payload, user) => {
  const existingSession = await getAccessibleSessionRecord(id, user)
  const professionalId = await resolveSessionProfessionalId(payload, user, existingSession)
  const data = { ...payload }
  const effectiveSessionContext = {
    childId: payload.childId ?? existingSession.child.id,
    professionalId,
    serviceId: payload.serviceId ?? existingSession.service.id,
  }
  let service = null

  await ensureProfessionalChildAccess({
    childId: effectiveSessionContext.childId,
    professionalId,
    user,
  })

  if (payload.childId || payload.professionalId || payload.serviceId) {
    service = await ensureSessionDependencies(effectiveSessionContext)
  }

  if (payload.endsAt === undefined && (payload.startsAt || payload.serviceId)) {
    const effectiveService =
      service ??
      (await ensureSessionDependencies({
        serviceId: effectiveSessionContext.serviceId,
      }))
    const effectiveStartsAt = payload.startsAt ?? existingSession.startsAt

    data.endsAt = new Date(effectiveStartsAt.getTime() + effectiveService.durationMinutes * 60000)
  }

  if (user.role === 'PROFESSIONAL') {
    data.professionalId = professionalId
  }

  try {
    return await updateSession(id, data)
  } catch {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión solicitada.')
  }
}

export const deleteSessionRecord = async (id, user) => {
  const accessibleSession = await getAccessibleSessionRecord(id, user)

  const session = await prisma.session.findUnique({
    where: { id: accessibleSession.id },
    select: {
      id: true,
      attendance: {
        select: {
          id: true,
          status: true,
        },
      },
      followUps: {
        select: {
          id: true,
          title: true,
        },
      },
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
        },
      },
    },
  })

  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión solicitada.')
  }

  const blockers = []

  if (session.attendance) {
    blockers.push({
      key: 'attendance',
      label: 'Asistencia registrada',
      count: 1,
      items: [`Estado: ${session.attendance.status}`],
      solution: 'Conservá la sesión y cancelala si ya no debe figurar como activa.',
    })
  }

  if (session.followUps.length) {
    blockers.push({
      key: 'followUps',
      label: 'Seguimientos asociados',
      count: session.followUps.length,
      items: session.followUps.slice(0, 3).map((followUp) => followUp.title || 'Seguimiento sin título'),
      solution: 'Mantené la sesión para preservar la trazabilidad clínica y operativa.',
    })
  }

  if (session.payments.length) {
    blockers.push({
      key: 'payments',
      label: 'Cobros vinculados',
      count: session.payments.length,
      items: session.payments
        .slice(0, 3)
        .map((payment) => `${payment.status} · $${Number(payment.amount).toFixed(0)}`),
      solution: 'Revisá el registro de cobros y conservá la sesión como respaldo administrativo.',
    })
  }

  if (blockers.length) {
    throw new AppError(
      409,
      'SESSION_DELETE_BLOCKED',
      'No se puede eliminar una sesión con historial operativo asociado.',
      {
        blockers,
        nextSteps: [
          'Si la sesión ya no debe seguir en agenda, cambiá su estado a Cancelada.',
          'Reservá el borrado solo para sesiones creadas por error y todavía sin movimiento.',
        ],
      },
    )
  }

  return deleteSession(id)
}

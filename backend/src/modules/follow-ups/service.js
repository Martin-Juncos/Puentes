import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'

import { createFollowUp, listFollowUps } from './repository.js'

const buildWhere = async (filters, user) => {
  const where = {}

  if (filters.childId) {
    where.childId = filters.childId
  }

  if (filters.professionalId) {
    where.professionalId = filters.professionalId
  }

  if (filters.sessionId) {
    where.sessionId = filters.sessionId
  }

  if (user.role === 'PROFESSIONAL') {
    where.professionalId = await resolveProfessionalProfileId(user.id)
  }

  return where
}

export const getFollowUps = async (filters, user) => listFollowUps(await buildWhere(filters, user))

export const createFollowUpRecord = async (payload, user) => {
  const professionalId =
    payload.professionalId ??
    (user.role === 'PROFESSIONAL' ? await resolveProfessionalProfileId(user.id) : undefined)

  if (!professionalId) {
    throw new AppError(
      400,
      'PROFESSIONAL_REQUIRED',
      'Debes indicar un profesional para registrar el seguimiento.',
    )
  }

  const [child, professional, session] = await Promise.all([
    prisma.child.findUnique({ where: { id: payload.childId }, select: { id: true } }),
    prisma.professionalProfile.findUnique({ where: { id: professionalId }, select: { id: true } }),
    payload.sessionId
      ? prisma.session.findUnique({ where: { id: payload.sessionId }, select: { id: true } })
      : Promise.resolve(true),
  ])

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña del seguimiento.')
  }

  if (!professional) {
    throw new AppError(404, 'PROFESSIONAL_NOT_FOUND', 'No se encontró el profesional del seguimiento.')
  }

  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión asociada al seguimiento.')
  }

  return createFollowUp({
    ...payload,
    professionalId,
    authorUserId: user.id,
  })
}

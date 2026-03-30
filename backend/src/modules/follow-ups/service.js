import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'
import { ensureFound } from '../../utils/records.js'

import { createFollowUp, deleteFollowUp, getFollowUp, listFollowUps, updateFollowUp } from './repository.js'

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

const resolveFollowUpProfessionalId = async (payload, user, existingFollowUp = null) => {
  if (user.role === 'PROFESSIONAL') {
    return existingFollowUp?.professionalId ?? resolveProfessionalProfileId(user.id)
  }

  return payload.professionalId ?? existingFollowUp?.professionalId
}

const validateFollowUpRelations = async ({ childId, professionalId, sessionId }) => {
  const [child, professional, session] = await Promise.all([
    prisma.child.findUnique({ where: { id: childId }, select: { id: true } }),
    prisma.professionalProfile.findUnique({ where: { id: professionalId }, select: { id: true } }),
    sessionId
      ? prisma.session.findUnique({ where: { id: sessionId }, select: { id: true } })
      : Promise.resolve(true),
  ])

  ensureFound(child, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña del seguimiento.')
  ensureFound(
    professional,
    'PROFESSIONAL_NOT_FOUND',
    'No se encontró el profesional del seguimiento.',
  )

  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión asociada al seguimiento.')
  }
}

export const getFollowUps = async (filters, user) => listFollowUps(await buildWhere(filters, user))

export const getAccessibleFollowUpById = async (id, user) =>
  getFollowUp({
    id,
    ...(await buildWhere({}, user)),
  })

export const getFollowUpRecord = async (id, user) =>
  ensureFound(await getAccessibleFollowUpById(id, user), 'FOLLOW_UP_NOT_FOUND', 'No se encontró el seguimiento solicitado.')

export const createFollowUpRecord = async (payload, user) => {
  const professionalId = await resolveFollowUpProfessionalId(payload, user)

  if (!professionalId) {
    throw new AppError(
      400,
      'PROFESSIONAL_REQUIRED',
      'Debes indicar un profesional para registrar el seguimiento.',
    )
  }

  await validateFollowUpRelations({
    childId: payload.childId,
    professionalId,
    sessionId: payload.sessionId,
  })

  return createFollowUp({
    ...payload,
    professionalId,
    authorUserId: user.id,
  })
}

export const updateFollowUpRecord = async (id, payload, user) => {
  const existingFollowUp = await getFollowUpRecord(id, user)
  const professionalId = await resolveFollowUpProfessionalId(payload, user, existingFollowUp)

  await validateFollowUpRelations({
    childId: payload.childId,
    professionalId,
    sessionId: payload.sessionId ?? existingFollowUp.sessionId,
  })

  return updateFollowUp(id, {
    childId: payload.childId,
    professionalId,
    followUpDate: payload.followUpDate,
    title: payload.title ?? null,
    summary: payload.summary ?? null,
    note: payload.note,
  })
}

export const deleteFollowUpRecord = async (id, user) => {
  const existingFollowUp = await getFollowUpRecord(id, user)

  return deleteFollowUp(existingFollowUp.id)
}

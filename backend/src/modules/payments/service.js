import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'

import { createPayment, listPayments, updatePayment } from './repository.js'

export const getPayments = async (filters = {}) =>
  listPayments({
    familyId: filters.familyId,
    childId: filters.childId,
    status: filters.status,
  })

export const createPaymentRecord = async ({ childId, familyId, sessionId, ...payload }, userId) => {
  const [child, family, session] = await Promise.all([
    prisma.child.findUnique({ where: { id: childId }, select: { id: true } }),
    prisma.family.findUnique({ where: { id: familyId }, select: { id: true } }),
    sessionId
      ? prisma.session.findUnique({ where: { id: sessionId }, select: { id: true } })
      : Promise.resolve(true),
  ])

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña del cobro.')
  }

  if (!family) {
    throw new AppError(404, 'FAMILY_NOT_FOUND', 'No se encontró la familia del cobro.')
  }

  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión asociada al cobro.')
  }

  return createPayment({
    childId,
    familyId,
    sessionId,
    ...payload,
    recordedByUserId: userId,
  })
}

export const updatePaymentRecord = async (id, payload) => {
  try {
    return await updatePayment(id, payload)
  } catch {
    throw new AppError(404, 'PAYMENT_NOT_FOUND', 'No se encontró el cobro solicitado.')
  }
}

import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'

import { listAttendances, upsertAttendance } from './repository.js'

export const getAttendances = async (filters = {}) =>
  listAttendances({
    status: filters.status,
    sessionId: filters.sessionId,
  })

export const saveAttendance = async ({ sessionId, status, notes, registeredByUserId }) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true },
  })

  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'No se encontró la sesión de asistencia.')
  }

  return upsertAttendance({
    sessionId,
    status,
    notes,
    registeredByUserId,
    registeredAt: new Date(),
  })
}

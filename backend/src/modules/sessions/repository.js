import { prisma } from '../../db/prisma.js'
import { sessionSelect } from '../../utils/recordSelects.js'

export const listSessions = (where = {}) =>
  prisma.session.findMany({
    where,
    orderBy: { startsAt: 'asc' },
    select: sessionSelect,
  })

export const createSession = (data) =>
  prisma.session.create({
    data,
    select: sessionSelect,
  })

export const updateSession = (id, data) =>
  prisma.session.update({
    where: { id },
    data,
    select: sessionSelect,
  })

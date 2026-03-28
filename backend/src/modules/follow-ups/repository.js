import { prisma } from '../../db/prisma.js'
import { followUpSelect } from '../../utils/recordSelects.js'

export const listFollowUps = (where = {}) =>
  prisma.followUpNote.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: followUpSelect,
  })

export const createFollowUp = (data) =>
  prisma.followUpNote.create({
    data,
    select: followUpSelect,
  })

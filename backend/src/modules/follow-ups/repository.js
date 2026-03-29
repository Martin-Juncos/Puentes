import { prisma } from '../../db/prisma.js'
import { followUpSelect } from '../../utils/recordSelects.js'

export const listFollowUps = (where = {}) =>
  prisma.followUpNote.findMany({
    where,
    orderBy: [{ followUpDate: 'desc' }, { createdAt: 'desc' }],
    select: followUpSelect,
  })

export const getFollowUp = (where) =>
  prisma.followUpNote.findFirst({
    where,
    select: followUpSelect,
  })

export const createFollowUp = (data) =>
  prisma.followUpNote.create({
    data,
    select: followUpSelect,
  })

export const updateFollowUp = (id, data) =>
  prisma.followUpNote.update({
    where: { id },
    data,
    select: followUpSelect,
  })

export const deleteFollowUp = (id) =>
  prisma.followUpNote.delete({
    where: { id },
    select: followUpSelect,
  })

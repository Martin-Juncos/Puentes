import { prisma } from '../../db/prisma.js'
import { familySelect } from '../../utils/recordSelects.js'

export const listFamilies = (where = {}) =>
  prisma.family.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: familySelect,
  })

export const getFamily = (id) =>
  prisma.family.findUnique({
    where: { id },
    select: familySelect,
  })

export const createFamily = (data) =>
  prisma.family.create({
    data,
    select: familySelect,
  })

export const updateFamily = (id, data) =>
  prisma.family.update({
    where: { id },
    data,
    select: familySelect,
  })

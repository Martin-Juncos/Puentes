import { prisma } from '../../db/prisma.js'
import { userSelect } from '../../utils/recordSelects.js'

export const findUserByEmail = (email) =>
  prisma.user.findUnique({
    where: { email },
    select: userSelect,
  })

export const listUsers = () =>
  prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: userSelect,
  })

export const createUser = (data) =>
  prisma.user.create({
    data,
    select: userSelect,
  })

export const updateUser = (id, data) =>
  prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  })

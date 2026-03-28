import { prisma } from '../../db/prisma.js'
import { userSelect } from '../../utils/recordSelects.js'

export const findUserByEmail = (email) =>
  prisma.user.findUnique({
    where: { email },
    select: userSelect,
  })

export const findUserById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: userSelect,
  })

export const listUsers = () =>
  prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: userSelect,
  })

export const createUserWithProfessionalProfile = ({ professionalDiscipline, ...data }) =>
  prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data,
      select: {
        id: true,
      },
    })

    if (data.role === 'PROFESSIONAL' && professionalDiscipline) {
      await tx.professionalProfile.create({
        data: {
          userId: createdUser.id,
          discipline: professionalDiscipline,
        },
      })
    }

    return tx.user.findUnique({
      where: { id: createdUser.id },
      select: userSelect,
    })
  })

export const updateUserWithProfessionalProfile = (id, { professionalDiscipline, ...data }) =>
  prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data,
      select: {
        id: true,
      },
    })

    if (professionalDiscipline) {
      await tx.professionalProfile.upsert({
        where: { userId: id },
        update: {
          discipline: professionalDiscipline,
        },
        create: {
          userId: id,
          discipline: professionalDiscipline,
        },
      })
    }

    return tx.user.findUnique({
      where: { id },
      select: userSelect,
    })
  })

export const deleteUser = (id) =>
  prisma.user.delete({
    where: { id },
    select: userSelect,
  })

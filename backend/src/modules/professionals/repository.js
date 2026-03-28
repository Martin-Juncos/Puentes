import { prisma } from '../../db/prisma.js'
import { professionalSelect } from '../../utils/recordSelects.js'

export const listProfessionalProfiles = (where = {}) =>
  prisma.professionalProfile.findMany({
    where,
    orderBy: {
      user: {
        fullName: 'asc',
      },
    },
    select: professionalSelect,
  })

export const upsertProfessionalProfile = ({ userId, ...data }) =>
  prisma.professionalProfile.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
    select: professionalSelect,
  })

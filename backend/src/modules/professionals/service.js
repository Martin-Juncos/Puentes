import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'

import { listProfessionalProfiles, upsertProfessionalProfile } from './repository.js'

export const getPublicProfessionals = async () =>
  listProfessionalProfiles({
    isHighlighted: true,
    user: {
      status: 'ACTIVE',
    },
  })

export const getManageProfessionals = async () => listProfessionalProfiles()

export const saveProfessionalProfile = async (payload) => {
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  })

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'No se encontró el usuario profesional.')
  }

  if (!['PROFESSIONAL', 'COORDINATION'].includes(user.role)) {
    throw new AppError(
      400,
      'INVALID_PROFESSIONAL_ROLE',
      'Solo usuarios profesionales o de coordinación pueden tener perfil profesional.',
    )
  }

  return upsertProfessionalProfile(payload)
}

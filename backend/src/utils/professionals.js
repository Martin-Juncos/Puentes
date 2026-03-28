import { prisma } from '../db/prisma.js'
import { AppError } from './AppError.js'

export const resolveProfessionalProfileId = async (userId) => {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!profile) {
    throw new AppError(
      404,
      'PROFESSIONAL_PROFILE_NOT_FOUND',
      'El usuario no tiene un perfil profesional asociado.',
    )
  }

  return profile.id
}

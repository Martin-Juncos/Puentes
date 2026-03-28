import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'

import { createChild, getChild, listChildren, updateChild, upsertAssignment } from './repository.js'

export const getChildren = async (user) => {
  if (user.role === 'PROFESSIONAL') {
    const professionalId = await resolveProfessionalProfileId(user.id)

    return listChildren({
      assignments: {
        some: {
          professionalId,
        },
      },
    })
  }

  return listChildren()
}

export const getChildById = async (id, user) => {
  const child = await getChild(id)

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')
  }

  if (user.role === 'PROFESSIONAL') {
    const professionalId = await resolveProfessionalProfileId(user.id)
    const isAssigned = child.assignments.some((assignment) => assignment.professional.id === professionalId)

    if (!isAssigned) {
      throw new AppError(
        403,
        'FORBIDDEN',
        'No tienes permisos para acceder a un caso no asignado a tu perfil profesional.',
      )
    }
  }

  return child
}

export const createChildRecord = async (payload) => {
  const family = await prisma.family.findUnique({
    where: { id: payload.familyId },
    select: { id: true },
  })

  if (!family) {
    throw new AppError(404, 'FAMILY_NOT_FOUND', 'No existe la familia indicada.')
  }

  return createChild(payload)
}

export const updateChildRecord = async (id, payload) => {
  try {
    return await updateChild(id, payload)
  } catch {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')
  }
}

export const assignProfessionalToChild = async ({ childId, professionalId, serviceId, notes, assignedByUserId }) => {
  const [child, professional] = await Promise.all([
    prisma.child.findUnique({ where: { id: childId }, select: { id: true } }),
    prisma.professionalProfile.findUnique({
      where: { id: professionalId },
      select: { id: true },
    }),
  ])

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña a asignar.')
  }

  if (!professional) {
    throw new AppError(404, 'PROFESSIONAL_NOT_FOUND', 'No se encontró el profesional seleccionado.')
  }

  if (serviceId) {
    const service = await prisma.service.findUnique({ where: { id: serviceId }, select: { id: true } })

    if (!service) {
      throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio seleccionado.')
    }
  }

  try {
    await upsertAssignment({
      childId,
      professionalId,
      serviceId,
      notes,
      assignedByUserId,
    })
  } catch {
    throw new AppError(
      409,
      'ASSIGNMENT_DUPLICATED',
      'La asignación para ese profesional y servicio ya existe.',
    )
  }

  return getChildById(childId)
}

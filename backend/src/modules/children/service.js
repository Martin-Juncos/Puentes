import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'

import {
  createChild,
  deleteAssignmentsByChild,
  deleteChild,
  getChild,
  listChildren,
  updateChild,
  upsertAssignment,
} from './repository.js'

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
  if (payload.familyId) {
    const family = await prisma.family.findUnique({
      where: { id: payload.familyId },
      select: { id: true },
    })

    if (!family) {
      throw new AppError(404, 'FAMILY_NOT_FOUND', 'No existe la familia indicada.')
    }
  }

  try {
    return await updateChild(id, payload)
  } catch {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')
  }
}

export const deleteChildRecord = async (id) => {
  const child = await prisma.child.findUnique({
    where: { id },
    select: {
      id: true,
      assignments: {
        select: {
          id: true,
        },
      },
      sessions: {
        select: {
          id: true,
        },
      },
      payments: {
        select: {
          id: true,
        },
      },
      followUps: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')
  }

  if (child.assignments.length || child.sessions.length || child.payments.length || child.followUps.length) {
    const blockers = []

    if (child.assignments.length) {
      blockers.push({
        key: 'assignments',
        label: 'Asignaciones profesionales',
        count: child.assignments.length,
        solution: 'Quitá o cerrá las asignaciones antes de intentar eliminar el caso.',
      })
    }

    if (child.sessions.length) {
      blockers.push({
        key: 'sessions',
        label: 'Sesiones registradas',
        count: child.sessions.length,
        solution: 'Si el proceso terminó, conservá el caso y marcá el estado como Alta o En pausa.',
      })
    }

    if (child.payments.length) {
      blockers.push({
        key: 'payments',
        label: 'Pagos asociados',
        count: child.payments.length,
        solution: 'No borres el caso mientras existan movimientos económicos vinculados.',
      })
    }

    if (child.followUps.length) {
      blockers.push({
        key: 'followUps',
        label: 'Seguimientos cargados',
        count: child.followUps.length,
        solution: 'Mantené el caso para preservar el historial de seguimiento interdisciplinario.',
      })
    }

    throw new AppError(
      409,
      'CHILD_DELETE_BLOCKED',
      'No se puede eliminar un caso con asignaciones, sesiones, pagos o seguimientos asociados.',
      {
        blockers,
        nextSteps: [
          'Usá estados como En pausa o Alta cuando el caso ya no deba operar activamente.',
          'Reservá el borrado para casos creados por error y todavía sin actividad vinculada.',
        ],
      },
    )
  }

  return deleteChild(id)
}

export const clearAssignmentsForChild = async (id, user) => {
  const child = await prisma.child.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!child) {
    throw new AppError(404, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')
  }

  await deleteAssignmentsByChild(id)

  return getChildById(id, user)
}

export const assignProfessionalToChild = async (
  { childId, professionalId, serviceId, notes, assignedByUserId },
  user,
) => {
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

  return getChildById(childId, user)
}

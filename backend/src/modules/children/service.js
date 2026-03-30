import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { resolveProfessionalProfileId } from '../../utils/professionals.js'
import { buildNotFoundError, ensureFound } from '../../utils/records.js'

import {
  createChild,
  deleteAssignmentsByChild,
  deleteChild,
  getChild,
  listChildren,
  updateChild,
  upsertAssignment,
} from './repository.js'

const childDeleteSelect = {
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
  messageThreads: {
    select: {
      id: true,
    },
  },
}

const getFamilyReference = async (familyId) =>
  prisma.family.findUnique({
    where: { id: familyId },
    select: { id: true },
  })

const getProfessionalReference = async (professionalId) =>
  prisma.professionalProfile.findUnique({
    where: { id: professionalId },
    select: { id: true },
  })

const getServiceReference = async (serviceId) =>
  prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true },
  })

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

export const getChildById = async (id) =>
  ensureFound(await getChild(id), 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')

export const createChildRecord = async (payload) => {
  ensureFound(await getFamilyReference(payload.familyId), 'FAMILY_NOT_FOUND', 'No existe la familia indicada.')

  return createChild(payload)
}

export const updateChildRecord = async (id, payload) => {
  if (payload.familyId) {
    ensureFound(
      await getFamilyReference(payload.familyId),
      'FAMILY_NOT_FOUND',
      'No existe la familia indicada.',
    )
  }

  try {
    return await updateChild(id, payload)
  } catch {
    throw buildNotFoundError('CHILD_NOT_FOUND', 'No se encontró el niño o la niña solicitada.')
  }
}

export const deleteChildRecord = async (id) => {
  const child = ensureFound(
    await prisma.child.findUnique({
      where: { id },
      select: childDeleteSelect,
    }),
    'CHILD_NOT_FOUND',
    'No se encontró el niño o la niña solicitada.',
  )

  if (
    child.assignments.length ||
    child.sessions.length ||
    child.payments.length ||
    child.followUps.length ||
    child.messageThreads.length
  ) {
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

    if (child.messageThreads.length) {
      blockers.push({
        key: 'messageThreads',
        label: 'Conversaciones internas',
        count: child.messageThreads.length,
        solution: 'Mantené el caso para conservar la mensajería y las alertas vinculadas.',
      })
    }

    throw new AppError(
      409,
      'CHILD_DELETE_BLOCKED',
      'No se puede eliminar un caso con asignaciones, sesiones, pagos, seguimientos o conversaciones asociadas.',
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

export const clearAssignmentsForChild = async (id) => {
  ensureFound(
    await prisma.child.findUnique({
      where: { id },
      select: { id: true },
    }),
    'CHILD_NOT_FOUND',
    'No se encontró el niño o la niña solicitada.',
  )

  await deleteAssignmentsByChild(id)

  return getChildById(id)
}

export const assignProfessionalToChild = async ({
  childId,
  professionalId,
  serviceId,
  notes,
  assignedByUserId,
}) => {
  const [child, professional, service] = await Promise.all([
    prisma.child.findUnique({ where: { id: childId }, select: { id: true } }),
    getProfessionalReference(professionalId),
    serviceId ? getServiceReference(serviceId) : Promise.resolve(null),
  ])

  ensureFound(child, 'CHILD_NOT_FOUND', 'No se encontró el niño o la niña a asignar.')
  ensureFound(professional, 'PROFESSIONAL_NOT_FOUND', 'No se encontró el profesional seleccionado.')

  if (serviceId) {
    ensureFound(service, 'SERVICE_NOT_FOUND', 'No se encontró el servicio seleccionado.')
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

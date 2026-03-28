import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'

import { createService, deleteService, getService, listServices, updateService } from './repository.js'

const DEFAULT_SERVICE_DURATION_MINUTES = 60

export const getPublicServices = async () => listServices({ status: 'ACTIVE' })

export const getManageServices = async () => listServices()

export const getServiceById = async (id) => {
  const service = await getService(id)

  if (!service) {
    throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio solicitado.')
  }

  return service
}

export const createServiceRecord = async (payload) => {
  try {
    return await createService({
      ...payload,
      durationMinutes: payload.durationMinutes ?? DEFAULT_SERVICE_DURATION_MINUTES,
    })
  } catch {
    throw new AppError(409, 'SERVICE_DUPLICATED', 'Ya existe un servicio con ese nombre.')
  }
}

export const updateServiceRecord = async (id, payload) => {
  try {
    return await updateService(id, payload)
  } catch (error) {
    if (error?.code === 'P2002') {
      throw new AppError(409, 'SERVICE_DUPLICATED', 'Ya existe un servicio con ese nombre.')
    }

    throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio solicitado.')
  }
}

export const deleteServiceRecord = async (id) => {
  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      sessions: {
        select: {
          id: true,
        },
      },
      assignments: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!service) {
    throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio solicitado.')
  }

  if (service.sessions.length || service.assignments.length) {
    const blockers = []

    if (service.sessions.length) {
      blockers.push({
        key: 'sessions',
        label: 'Sesiones agendadas o históricas',
        count: service.sessions.length,
        solution: 'Mantené el servicio para preservar la trazabilidad de agenda e historial.',
      })
    }

    if (service.assignments.length) {
      blockers.push({
        key: 'assignments',
        label: 'Asignaciones de casos',
        count: service.assignments.length,
        solution: 'Revisá o actualizá las asignaciones antes de pensar en eliminar este servicio.',
      })
    }

    throw new AppError(
      409,
      'SERVICE_DELETE_BLOCKED',
      'No se puede eliminar un servicio con agenda o asignaciones asociadas.',
      {
        blockers,
        nextSteps: [
          'Si el servicio ya no debe ofrecerse, cambiá el estado a Inactivo.',
          'Reservá el borrado solo para servicios creados por error y todavía sin uso operativo.',
        ],
      },
    )
  }

  return deleteService(id)
}

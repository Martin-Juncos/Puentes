import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'

import { createFamily, deleteFamily, getFamily, listFamilies, updateFamily } from './repository.js'

export const getFamilies = async () => listFamilies()

export const getFamilyById = async (id) => {
  const family = await getFamily(id)

  if (!family) {
    throw new AppError(404, 'FAMILY_NOT_FOUND', 'No se encontró la familia solicitada.')
  }

  return family
}

export const createFamilyRecord = async (payload) => createFamily(payload)

export const updateFamilyRecord = async (id, payload) => {
  try {
    return await updateFamily(id, payload)
  } catch {
    throw new AppError(404, 'FAMILY_NOT_FOUND', 'No se encontró la familia solicitada.')
  }
}

export const deleteFamilyRecord = async (id) => {
  const family = await prisma.family.findUnique({
    where: { id },
    select: {
      id: true,
      children: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      payments: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!family) {
    throw new AppError(404, 'FAMILY_NOT_FOUND', 'No se encontró la familia solicitada.')
  }

  if (family.children.length || family.payments.length) {
    const blockers = []

    if (family.children.length) {
      blockers.push({
        key: 'children',
        label: 'Niños y niñas vinculados',
        count: family.children.length,
        items: family.children.slice(0, 3).map((child) => `${child.firstName} ${child.lastName}`),
        solution: 'Primero reubicá o archivá los casos vinculados antes de eliminar la familia.',
      })
    }

    if (family.payments.length) {
      blockers.push({
        key: 'payments',
        label: 'Pagos registrados',
        count: family.payments.length,
        solution: 'Conservá la familia para mantener la trazabilidad administrativa de los pagos.',
      })
    }

    throw new AppError(
      409,
      'FAMILY_DELETE_BLOCKED',
      'No se puede eliminar una familia con niños, niñas o pagos asociados.',
      {
        blockers,
        nextSteps: [
          'Si la familia ya no está activa, cambiá su estado a Archivada.',
          'Eliminá solo familias sin casos ni movimientos económicos asociados.',
        ],
      },
    )
  }

  return deleteFamily(id)
}

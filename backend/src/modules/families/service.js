import { AppError } from '../../utils/AppError.js'

import { createFamily, getFamily, listFamilies, updateFamily } from './repository.js'

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

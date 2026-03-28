import { AppError } from '../../utils/AppError.js'

import { createService, listServices, updateService } from './repository.js'

export const getPublicServices = async () => listServices({ status: 'ACTIVE' })

export const getManageServices = async () => listServices()

export const createServiceRecord = async (payload) => {
  try {
    return await createService(payload)
  } catch {
    throw new AppError(409, 'SERVICE_DUPLICATED', 'Ya existe un servicio con ese nombre.')
  }
}

export const updateServiceRecord = async (id, payload) => {
  try {
    return await updateService(id, payload)
  } catch {
    throw new AppError(404, 'SERVICE_NOT_FOUND', 'No se encontró el servicio solicitado.')
  }
}

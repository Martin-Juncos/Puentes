import { sendSuccess } from '../../utils/response.js'

import { createServiceRecord, getManageServices, getPublicServices, updateServiceRecord } from './service.js'

export const listPublicServicesController = async (_req, res) =>
  sendSuccess(res, await getPublicServices())

export const listManageServicesController = async (_req, res) =>
  sendSuccess(res, await getManageServices())

export const createServiceController = async (req, res) =>
  sendSuccess(res, await createServiceRecord(req.body), undefined, 201)

export const updateServiceController = async (req, res) =>
  sendSuccess(res, await updateServiceRecord(req.params.id, req.body))

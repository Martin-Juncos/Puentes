import { sendSuccess } from '../../utils/response.js'

import { getManageSettings, getPublicSettings, updateManageSettings } from './service.js'

export const getPublicSettingsController = async (_req, res) =>
  sendSuccess(res, await getPublicSettings())

export const getManageSettingsController = async (_req, res) =>
  sendSuccess(res, await getManageSettings())

export const updateManageSettingsController = async (req, res) =>
  sendSuccess(res, await updateManageSettings(req.body))

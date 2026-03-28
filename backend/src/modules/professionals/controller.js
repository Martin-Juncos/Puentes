import { sendSuccess } from '../../utils/response.js'

import { getManageProfessionals, getPublicProfessionals, saveProfessionalProfile } from './service.js'

export const listPublicProfessionalsController = async (_req, res) =>
  sendSuccess(res, await getPublicProfessionals())

export const listManageProfessionalsController = async (_req, res) =>
  sendSuccess(res, await getManageProfessionals())

export const upsertProfessionalController = async (req, res) =>
  sendSuccess(res, await saveProfessionalProfile(req.body), undefined, 201)

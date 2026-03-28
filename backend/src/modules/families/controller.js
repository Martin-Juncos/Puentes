import { sendSuccess } from '../../utils/response.js'

import { createFamilyRecord, deleteFamilyRecord, getFamilies, getFamilyById, updateFamilyRecord } from './service.js'

export const listFamiliesController = async (_req, res) => sendSuccess(res, await getFamilies())

export const getFamilyController = async (req, res) =>
  sendSuccess(res, await getFamilyById(req.params.id))

export const createFamilyController = async (req, res) =>
  sendSuccess(res, await createFamilyRecord(req.body), undefined, 201)

export const updateFamilyController = async (req, res) =>
  sendSuccess(res, await updateFamilyRecord(req.params.id, req.body))

export const deleteFamilyController = async (req, res) =>
  sendSuccess(res, await deleteFamilyRecord(req.params.id))

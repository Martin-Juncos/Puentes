import { sendSuccess } from '../../utils/response.js'

import { createSessionRecord, getSessions, updateSessionRecord } from './service.js'

export const listSessionsController = async (req, res) =>
  sendSuccess(res, await getSessions(req.query, req.user))

export const createSessionController = async (req, res) =>
  sendSuccess(res, await createSessionRecord(req.body, req.user), undefined, 201)

export const updateSessionController = async (req, res) =>
  sendSuccess(res, await updateSessionRecord(req.params.id, req.body, req.user))

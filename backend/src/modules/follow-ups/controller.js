import { sendSuccess } from '../../utils/response.js'

import { createFollowUpRecord, getFollowUps } from './service.js'

export const listFollowUpsController = async (req, res) =>
  sendSuccess(res, await getFollowUps(req.query, req.user))

export const createFollowUpController = async (req, res) =>
  sendSuccess(res, await createFollowUpRecord(req.body, req.user), undefined, 201)

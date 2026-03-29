import { sendSuccess } from '../../utils/response.js'

import {
  createFollowUpRecord,
  deleteFollowUpRecord,
  getFollowUpRecord,
  getFollowUps,
  updateFollowUpRecord,
} from './service.js'

export const listFollowUpsController = async (req, res) =>
  sendSuccess(res, await getFollowUps(req.query, req.user))

export const getFollowUpController = async (req, res) =>
  sendSuccess(res, await getFollowUpRecord(req.params.id, req.user))

export const createFollowUpController = async (req, res) =>
  sendSuccess(res, await createFollowUpRecord(req.body, req.user), undefined, 201)

export const updateFollowUpController = async (req, res) =>
  sendSuccess(res, await updateFollowUpRecord(req.params.id, req.body, req.user))

export const deleteFollowUpController = async (req, res) =>
  sendSuccess(res, await deleteFollowUpRecord(req.params.id, req.user))

import { sendSuccess } from '../../utils/response.js'

import {
  createMessageRecord,
  createMessageThreadRecord,
  getMessageRecipients,
  getMessageThreadRecord,
  getMessageThreads,
  markMessageThreadAsRead,
} from './service.js'

export const listMessageThreadsController = async (req, res) =>
  sendSuccess(res, await getMessageThreads(req.query, req.user))

export const listMessageRecipientsController = async (req, res) =>
  sendSuccess(res, await getMessageRecipients(req.query, req.user))

export const getMessageThreadController = async (req, res) =>
  sendSuccess(res, await getMessageThreadRecord(req.params.id, req.user))

export const createMessageThreadController = async (req, res) =>
  sendSuccess(res, await createMessageThreadRecord(req.body, req.user), undefined, 201)

export const createMessageController = async (req, res) =>
  sendSuccess(res, await createMessageRecord(req.params.id, req.body, req.user))

export const markMessageThreadReadController = async (req, res) =>
  sendSuccess(res, await markMessageThreadAsRead(req.params.id, req.user))

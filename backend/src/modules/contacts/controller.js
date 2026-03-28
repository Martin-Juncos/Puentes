import { sendSuccess } from '../../utils/response.js'

import { createContactInquiry, listContactInquiries } from './service.js'

export const createContactController = async (req, res) =>
  sendSuccess(res, await createContactInquiry(req.body), undefined, 201)

export const listContactController = async (req, res) =>
  sendSuccess(res, await listContactInquiries(req.query.status))

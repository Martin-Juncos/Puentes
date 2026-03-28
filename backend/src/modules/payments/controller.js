import { sendSuccess } from '../../utils/response.js'

import { createPaymentRecord, getPayments, updatePaymentRecord } from './service.js'

export const listPaymentsController = async (req, res) =>
  sendSuccess(res, await getPayments(req.query))

export const createPaymentController = async (req, res) =>
  sendSuccess(res, await createPaymentRecord(req.body, req.user.id), undefined, 201)

export const updatePaymentController = async (req, res) =>
  sendSuccess(res, await updatePaymentRecord(req.params.id, req.body))

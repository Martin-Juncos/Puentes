import { sendSuccess } from '../../utils/response.js'

import { getDashboardSummary } from './service.js'

export const getDashboardController = async (req, res) =>
  sendSuccess(res, await getDashboardSummary(req.user))

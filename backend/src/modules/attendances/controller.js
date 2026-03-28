import { sendSuccess } from '../../utils/response.js'

import { getAttendances, saveAttendance } from './service.js'

export const listAttendancesController = async (req, res) =>
  sendSuccess(res, await getAttendances(req.query))

export const upsertAttendanceController = async (req, res) =>
  sendSuccess(
    res,
    await saveAttendance({
      ...req.body,
      registeredByUserId: req.user.id,
    }),
    undefined,
    201,
  )

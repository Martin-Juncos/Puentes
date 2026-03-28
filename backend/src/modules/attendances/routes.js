import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import { listAttendancesController, upsertAttendanceController } from './controller.js'
import { attendanceQuerySchema, upsertAttendanceSchema } from './validation.js'

export const attendancesRouter = Router()

attendancesRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY'))

attendancesRouter.get('/', validate(attendanceQuerySchema), asyncHandler(listAttendancesController))
attendancesRouter.post('/', validate(upsertAttendanceSchema), asyncHandler(upsertAttendanceController))

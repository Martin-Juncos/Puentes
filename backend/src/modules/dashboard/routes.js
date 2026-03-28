import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'

import { getDashboardController } from './controller.js'

export const dashboardRouter = Router()

dashboardRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'))
dashboardRouter.get('/', asyncHandler(getDashboardController))

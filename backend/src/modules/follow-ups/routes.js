import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import { createFollowUpController, listFollowUpsController } from './controller.js'
import { createFollowUpSchema, followUpQuerySchema } from './validation.js'

export const followUpsRouter = Router()

followUpsRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'PROFESSIONAL'))

followUpsRouter.get('/', validate(followUpQuerySchema), asyncHandler(listFollowUpsController))
followUpsRouter.post('/', validate(createFollowUpSchema), asyncHandler(createFollowUpController))

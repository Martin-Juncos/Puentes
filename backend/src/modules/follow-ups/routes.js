import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  createFollowUpController,
  deleteFollowUpController,
  getFollowUpController,
  listFollowUpsController,
  updateFollowUpController,
} from './controller.js'
import {
  createFollowUpSchema,
  deleteFollowUpSchema,
  followUpQuerySchema,
  getFollowUpSchema,
  updateFollowUpSchema,
} from './validation.js'

export const followUpsRouter = Router()

followUpsRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'PROFESSIONAL'))

followUpsRouter.get('/', validate(followUpQuerySchema), asyncHandler(listFollowUpsController))
followUpsRouter.get('/:id', validate(getFollowUpSchema), asyncHandler(getFollowUpController))
followUpsRouter.post('/', validate(createFollowUpSchema), asyncHandler(createFollowUpController))
followUpsRouter.patch('/:id', validate(updateFollowUpSchema), asyncHandler(updateFollowUpController))
followUpsRouter.delete('/:id', validate(deleteFollowUpSchema), asyncHandler(deleteFollowUpController))

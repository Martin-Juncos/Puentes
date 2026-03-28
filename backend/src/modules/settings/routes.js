import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  getManageSettingsController,
  getPublicSettingsController,
  updateManageSettingsController,
} from './controller.js'
import { updateSettingsSchema } from './validation.js'

export const settingsRouter = Router()

settingsRouter.get('/', asyncHandler(getPublicSettingsController))

settingsRouter.get(
  '/manage',
  authenticate,
  authorize('ADMIN', 'COORDINATION', 'SECRETARY'),
  asyncHandler(getManageSettingsController),
)

settingsRouter.patch(
  '/manage',
  authenticate,
  authorize('ADMIN'),
  validate(updateSettingsSchema),
  asyncHandler(updateManageSettingsController),
)

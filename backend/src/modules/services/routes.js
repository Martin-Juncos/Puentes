import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  createServiceController,
  listManageServicesController,
  listPublicServicesController,
  updateServiceController,
} from './controller.js'
import { createServiceSchema, updateServiceSchema } from './validation.js'

export const servicesRouter = Router()

servicesRouter.get('/', asyncHandler(listPublicServicesController))
servicesRouter.get(
  '/manage',
  authenticate,
  authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'),
  asyncHandler(listManageServicesController),
)
servicesRouter.post(
  '/',
  authenticate,
  authorize('ADMIN', 'COORDINATION'),
  validate(createServiceSchema),
  asyncHandler(createServiceController),
)
servicesRouter.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'COORDINATION'),
  validate(updateServiceSchema),
  asyncHandler(updateServiceController),
)

import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  createSessionController,
  deleteSessionController,
  listSessionsController,
  updateSessionController,
} from './controller.js'
import {
  createSessionSchema,
  deleteSessionSchema,
  sessionQuerySchema,
  updateSessionSchema,
} from './validation.js'

export const sessionsRouter = Router()

sessionsRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'))

sessionsRouter.get('/', validate(sessionQuerySchema), asyncHandler(listSessionsController))
sessionsRouter.post(
  '/',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'),
  validate(createSessionSchema),
  asyncHandler(createSessionController),
)
sessionsRouter.patch(
  '/:id',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'),
  validate(updateSessionSchema),
  asyncHandler(updateSessionController),
)
sessionsRouter.delete(
  '/:id',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'),
  validate(deleteSessionSchema),
  asyncHandler(deleteSessionController),
)

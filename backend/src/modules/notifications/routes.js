import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  getUnreadNotificationsCountController,
  listNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from './controller.js'
import { notificationsQuerySchema, readNotificationSchema } from './validation.js'

export const notificationsRouter = Router()

notificationsRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'))

notificationsRouter.get('/', validate(notificationsQuerySchema), asyncHandler(listNotificationsController))
notificationsRouter.get('/unread-count', asyncHandler(getUnreadNotificationsCountController))
notificationsRouter.post('/read-all', asyncHandler(markAllNotificationsReadController))
notificationsRouter.post('/:id/read', validate(readNotificationSchema), asyncHandler(markNotificationReadController))

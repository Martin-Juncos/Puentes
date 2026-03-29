import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  createMessageController,
  createMessageThreadController,
  getMessageThreadController,
  listMessageRecipientsController,
  listMessageThreadsController,
  markMessageThreadReadController,
} from './controller.js'
import {
  createMessageSchema,
  createMessageThreadSchema,
  getMessageThreadSchema,
  markThreadReadSchema,
  messageRecipientsQuerySchema,
  messageThreadsQuerySchema,
} from './validation.js'

export const messagesRouter = Router()

messagesRouter.use(authenticate, authorize('COORDINATION', 'SECRETARY', 'PROFESSIONAL'))

messagesRouter.get('/threads', validate(messageThreadsQuerySchema), asyncHandler(listMessageThreadsController))
messagesRouter.get('/recipients', validate(messageRecipientsQuerySchema), asyncHandler(listMessageRecipientsController))
messagesRouter.get('/threads/:id', validate(getMessageThreadSchema), asyncHandler(getMessageThreadController))
messagesRouter.post('/threads', validate(createMessageThreadSchema), asyncHandler(createMessageThreadController))
messagesRouter.post('/threads/:id/messages', validate(createMessageSchema), asyncHandler(createMessageController))
messagesRouter.post('/threads/:id/read', validate(markThreadReadSchema), asyncHandler(markMessageThreadReadController))

import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import { createContactController, listContactController } from './controller.js'
import { contactQuerySchema, createContactSchema } from './validation.js'

export const contactsRouter = Router()

contactsRouter.post('/', validate(createContactSchema), asyncHandler(createContactController))
contactsRouter.get(
  '/',
  authenticate,
  authorize('ADMIN', 'COORDINATION', 'SECRETARY'),
  validate(contactQuerySchema),
  asyncHandler(listContactController),
)

import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import { createUserController, listUsersController, updateUserController } from './controller.js'
import { createUserSchema, updateUserSchema } from './validation.js'

export const usersRouter = Router()

usersRouter.use(authenticate, authorize('ADMIN'))

usersRouter.get('/', asyncHandler(listUsersController))
usersRouter.post('/', validate(createUserSchema), asyncHandler(createUserController))
usersRouter.patch('/:id', validate(updateUserSchema), asyncHandler(updateUserController))

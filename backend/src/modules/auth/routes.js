import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { validate } from '../../middleware/validate.js'

import { loginController, logoutController, meController } from './controller.js'
import { loginSchema } from './validation.js'

export const authRouter = Router()

authRouter.post('/login', validate(loginSchema), asyncHandler(loginController))
authRouter.post('/logout', asyncHandler(logoutController))
authRouter.get('/me', authenticate, asyncHandler(meController))

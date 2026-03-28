import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import { createPaymentController, listPaymentsController, updatePaymentController } from './controller.js'
import { createPaymentSchema, paymentQuerySchema, updatePaymentSchema } from './validation.js'

export const paymentsRouter = Router()

paymentsRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY'))

paymentsRouter.get('/', validate(paymentQuerySchema), asyncHandler(listPaymentsController))
paymentsRouter.post('/', validate(createPaymentSchema), asyncHandler(createPaymentController))
paymentsRouter.patch('/:id', validate(updatePaymentSchema), asyncHandler(updatePaymentController))

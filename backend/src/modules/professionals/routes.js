import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  listManageProfessionalsController,
  listPublicProfessionalsController,
  upsertProfessionalController,
} from './controller.js'
import { upsertProfessionalSchema } from './validation.js'

export const professionalsRouter = Router()

professionalsRouter.get('/', asyncHandler(listPublicProfessionalsController))

professionalsRouter.get(
  '/manage',
  authenticate,
  authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'),
  asyncHandler(listManageProfessionalsController),
)

professionalsRouter.post(
  '/',
  authenticate,
  authorize('ADMIN', 'COORDINATION'),
  validate(upsertProfessionalSchema),
  asyncHandler(upsertProfessionalController),
)

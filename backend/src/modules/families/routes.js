import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  createFamilyController,
  deleteFamilyController,
  getFamilyController,
  listFamiliesController,
  updateFamilyController,
} from './controller.js'
import { createFamilySchema, deleteFamilySchema, updateFamilySchema } from './validation.js'

export const familiesRouter = Router()

familiesRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'))

familiesRouter.get('/', asyncHandler(listFamiliesController))
familiesRouter.get('/:id', validate({ params: updateFamilySchema.params }), asyncHandler(getFamilyController))
familiesRouter.post('/', validate(createFamilySchema), asyncHandler(createFamilyController))
familiesRouter.patch('/:id', validate(updateFamilySchema), asyncHandler(updateFamilyController))
familiesRouter.delete('/:id', validate(deleteFamilySchema), asyncHandler(deleteFamilyController))

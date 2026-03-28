import { Router } from 'express'

import { asyncHandler } from '../../middleware/asyncHandler.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'
import { validate } from '../../middleware/validate.js'

import {
  createAssignmentController,
  createChildController,
  deleteAssignmentsController,
  deleteChildController,
  getChildController,
  listChildrenController,
  updateChildController,
} from './controller.js'
import { createAssignmentSchema, createChildSchema, deleteChildSchema, updateChildSchema } from './validation.js'

export const childrenRouter = Router()

childrenRouter.use(authenticate, authorize('ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL'))

childrenRouter.get('/', asyncHandler(listChildrenController))
childrenRouter.get('/:id', validate({ params: updateChildSchema.params }), asyncHandler(getChildController))
childrenRouter.post('/', authorize('ADMIN', 'COORDINATION', 'SECRETARY'), validate(createChildSchema), asyncHandler(createChildController))
childrenRouter.patch(
  '/:id',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY'),
  validate(updateChildSchema),
  asyncHandler(updateChildController),
)
childrenRouter.delete(
  '/:id',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY'),
  validate(deleteChildSchema),
  asyncHandler(deleteChildController),
)
childrenRouter.post(
  '/:id/assignments',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY'),
  validate(createAssignmentSchema),
  asyncHandler(createAssignmentController),
)
childrenRouter.delete(
  '/:id/assignments',
  authorize('ADMIN', 'COORDINATION', 'SECRETARY'),
  validate(deleteChildSchema),
  asyncHandler(deleteAssignmentsController),
)

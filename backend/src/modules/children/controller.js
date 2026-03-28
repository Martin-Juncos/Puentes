import { sendSuccess } from '../../utils/response.js'

import {
  assignProfessionalToChild,
  clearAssignmentsForChild,
  createChildRecord,
  deleteChildRecord,
  getChildById,
  getChildren,
  updateChildRecord,
} from './service.js'

export const listChildrenController = async (req, res) => sendSuccess(res, await getChildren(req.user))

export const getChildController = async (req, res) =>
  sendSuccess(res, await getChildById(req.params.id, req.user))

export const createChildController = async (req, res) =>
  sendSuccess(res, await createChildRecord(req.body), undefined, 201)

export const updateChildController = async (req, res) =>
  sendSuccess(res, await updateChildRecord(req.params.id, req.body))

export const deleteChildController = async (req, res) =>
  sendSuccess(res, await deleteChildRecord(req.params.id))

export const deleteAssignmentsController = async (req, res) =>
  sendSuccess(res, await clearAssignmentsForChild(req.params.id, req.user))

export const createAssignmentController = async (req, res) =>
  sendSuccess(
    res,
    await assignProfessionalToChild({
      childId: req.params.id,
      ...req.body,
      assignedByUserId: req.user.id,
    }, req.user),
  )

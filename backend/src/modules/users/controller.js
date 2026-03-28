import { sendSuccess } from '../../utils/response.js'

import { createUserRecord, deleteUserRecord, getUsers, updateUserRecord } from './service.js'

export const listUsersController = async (_req, res) => sendSuccess(res, await getUsers())

export const createUserController = async (req, res) =>
  sendSuccess(res, await createUserRecord(req.body), undefined, 201)

export const updateUserController = async (req, res) =>
  sendSuccess(res, await updateUserRecord(req.params.id, req.body))

export const deleteUserController = async (req, res) =>
  sendSuccess(res, await deleteUserRecord(req.params.id, req.user.id))

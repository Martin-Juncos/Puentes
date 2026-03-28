import bcrypt from 'bcryptjs'

import { AppError } from '../../utils/AppError.js'

import { createUser, findUserByEmail, listUsers, updateUser } from './repository.js'

export const getUsers = async () => listUsers()

export const createUserRecord = async ({ password, ...payload }) => {
  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    throw new AppError(409, 'USER_EMAIL_TAKEN', 'Ya existe un usuario con ese email.')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  return createUser({
    ...payload,
    passwordHash,
  })
}

export const updateUserRecord = async (id, payload) => {
  const data = { ...payload }

  if (payload.email) {
    const existingUser = await findUserByEmail(payload.email)

    if (existingUser && existingUser.id !== id) {
      throw new AppError(409, 'USER_EMAIL_TAKEN', 'Ya existe un usuario con ese email.')
    }
  }

  if (payload.password) {
    data.passwordHash = await bcrypt.hash(payload.password, 10)
    delete data.password
  }

  try {
    return await updateUser(id, data)
  } catch {
    throw new AppError(404, 'USER_NOT_FOUND', 'No se encontró el usuario solicitado.')
  }
}

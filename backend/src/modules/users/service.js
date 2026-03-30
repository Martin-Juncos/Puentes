import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { AppError } from '../../utils/AppError.js'
import { buildNotFoundError, ensureFound } from '../../utils/records.js'

import {
  createUserWithProfessionalProfile,
  deleteUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUserWithProfessionalProfile,
} from './repository.js'

const getUniqueUserByEmail = async (email, currentUserId = null) => {
  if (!email) {
    return null
  }

  const existingUser = await findUserByEmail(email)

  if (existingUser && existingUser.id !== currentUserId) {
    throw new AppError(409, 'USER_EMAIL_TAKEN', 'Ya existe un usuario con ese email.')
  }

  return existingUser
}

const validateProfessionalRoleTransition = ({ currentUser, nextRole, requestedDiscipline }) => {
  if (nextRole === 'PROFESSIONAL' && !currentUser.professionalProfile && requestedDiscipline === undefined) {
    throw new AppError(
      400,
      'PROFESSIONAL_DISCIPLINE_REQUIRED',
      'Debes indicar el tipo de profesional para usuarios profesionales.',
    )
  }

  if (requestedDiscipline && nextRole !== 'PROFESSIONAL') {
    throw new AppError(
      400,
      'INVALID_PROFESSIONAL_DISCIPLINE',
      'El tipo profesional solo corresponde a usuarios con rol profesional.',
    )
  }

  if (currentUser.professionalProfile && !['PROFESSIONAL', 'COORDINATION'].includes(nextRole)) {
    throw new AppError(
      409,
      'USER_HAS_PROFESSIONAL_PROFILE',
      'No puedes cambiar este usuario a un rol no profesional porque tiene agenda o perfil asociado.',
    )
  }
}

const mapPasswordPayload = async (payload) => {
  const data = { ...payload }

  if (payload.password) {
    data.passwordHash = await bcrypt.hash(payload.password, 10)
    delete data.password
  }

  return data
}

export const getUsers = async () => listUsers()

export const createUserRecord = async ({ password, professionalDiscipline, ...payload }) => {
  await getUniqueUserByEmail(payload.email)

  const passwordHash = await bcrypt.hash(password, 10)

  return createUserWithProfessionalProfile({
    ...payload,
    professionalDiscipline,
    passwordHash,
  })
}

export const updateUserRecord = async (id, payload) => {
  const currentUser = ensureFound(
    await findUserById(id),
    'USER_NOT_FOUND',
    'No se encontró el usuario solicitado.',
  )

  await getUniqueUserByEmail(payload.email, id)

  const nextRole = payload.role ?? currentUser.role
  const requestedDiscipline = payload.professionalDiscipline

  validateProfessionalRoleTransition({
    currentUser,
    nextRole,
    requestedDiscipline,
  })

  try {
    return await updateUserWithProfessionalProfile(id, await mapPasswordPayload(payload))
  } catch {
    throw buildNotFoundError('USER_NOT_FOUND', 'No se encontró el usuario solicitado.')
  }
}

export const deleteUserRecord = async (id, currentUserId) => {
  if (id === currentUserId) {
    throw new AppError(
      409,
      'USER_SELF_DELETE',
      'No puedes eliminar tu propio usuario mientras tienes la sesión activa.',
    )
  }

  try {
    return await deleteUser(id)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw buildNotFoundError('USER_NOT_FOUND', 'No se encontró el usuario solicitado.')
      }

      if (error.code === 'P2003') {
        throw new AppError(
          409,
          'USER_DELETE_BLOCKED',
          'No se puede eliminar porque el usuario tiene registros vinculados en la operación diaria.',
        )
      }
    }

    throw error
  }
}

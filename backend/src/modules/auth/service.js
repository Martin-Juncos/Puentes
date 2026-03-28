import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '../../config/env.js'
import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { getCapabilitiesForRole } from '../../utils/permissions.js'
import { userSelect } from '../../utils/recordSelects.js'

const sanitizeUser = (user) => ({
  ...user,
  permissions: getCapabilitiesForRole(user.role),
})

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      ...userSelect,
      passwordHash: true,
    },
  })

  if (!user) {
    throw new AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Email o contraseña incorrectos.')
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatches) {
    throw new AppError(401, 'AUTH_INVALID_CREDENTIALS', 'Email o contraseña incorrectos.')
  }

  if (user.status !== 'ACTIVE') {
    throw new AppError(403, 'AUTH_INACTIVE_USER', 'El usuario se encuentra inactivo.')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  )

  const { passwordHash: _passwordHash, ...safeUser } = user

  return {
    token,
    user: sanitizeUser(safeUser),
  }
}

export const getSessionUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  })

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'No se encontró el usuario de la sesión.')
  }

  return sanitizeUser(user)
}

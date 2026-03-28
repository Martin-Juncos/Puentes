import jwt from 'jsonwebtoken'

import { prisma } from '../db/prisma.js'
import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'
import { userSelect } from '../utils/recordSelects.js'

export const authenticate = async (req, _res, next) => {
  try {
    const token = req.cookies?.[env.cookieName]

    if (!token) {
      throw new AppError(401, 'AUTH_REQUIRED', 'Debes iniciar sesión para continuar.')
    }

    const payload = jwt.verify(token, env.jwtSecret)

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: userSelect,
    })

    if (!user || user.status !== 'ACTIVE') {
      throw new AppError(401, 'AUTH_INVALID', 'La sesión no es válida o el usuario está inactivo.')
    }

    req.user = user
    next()
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError(401, 'AUTH_INVALID', 'La sesión no es válida o expiró.'),
    )
  }
}

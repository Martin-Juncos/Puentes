import { AppError } from '../utils/AppError.js'

export const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'AUTH_REQUIRED', 'Debes iniciar sesión para continuar.'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, 'FORBIDDEN', 'No tienes permisos suficientes para realizar esta acción.'),
      )
    }

    return next()
  }

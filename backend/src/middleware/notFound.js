import { AppError } from '../utils/AppError.js'

export const notFoundHandler = (req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', `No se encontró la ruta ${req.originalUrl}.`))
}

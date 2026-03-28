import { AppError } from '../utils/AppError.js'

export const validate =
  (schemas) =>
  (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query)
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params)
      }

      next()
    } catch (error) {
      next(
        new AppError(400, 'VALIDATION_ERROR', 'La solicitud contiene datos inválidos.', error.issues),
      )
    }
  }

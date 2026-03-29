import { AppError } from '../utils/AppError.js'

export const validate =
  (schemas) =>
  (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query)
        Object.keys(req.query).forEach((key) => {
          delete req.query[key]
        })
        Object.assign(req.query, parsedQuery)
      }

      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params)
        Object.keys(req.params).forEach((key) => {
          delete req.params[key]
        })
        Object.assign(req.params, parsedParams)
      }

      next()
    } catch (error) {
      next(
        new AppError(400, 'VALIDATION_ERROR', 'La solicitud contiene datos inválidos.', error.issues),
      )
    }
  }

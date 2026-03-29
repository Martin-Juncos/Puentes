import { AppError } from '../utils/AppError.js'

const replaceRequestSegment = (req, key, value) => {
  try {
    Object.defineProperty(req, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value,
    })
    return
  } catch {
    // Fallback for request shapes that don't allow redefining the property.
  }

  if (req[key] && typeof req[key] === 'object') {
    Object.keys(req[key]).forEach((segmentKey) => {
      delete req[key][segmentKey]
    })
    Object.assign(req[key], value)
    return
  }

  req[key] = value
}

export const validate =
  (schemas) =>
  (req, _res, next) => {
    try {
      if (schemas.body) {
        replaceRequestSegment(req, 'body', schemas.body.parse(req.body))
      }

      if (schemas.query) {
        replaceRequestSegment(req, 'query', schemas.query.parse(req.query))
      }

      if (schemas.params) {
        replaceRequestSegment(req, 'params', schemas.params.parse(req.params))
      }

      next()
    } catch (error) {
      next(
        new AppError(400, 'VALIDATION_ERROR', 'La solicitud contiene datos inválidos.', error.issues),
      )
    }
  }

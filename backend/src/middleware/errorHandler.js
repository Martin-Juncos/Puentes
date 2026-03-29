import { Prisma } from '@prisma/client'

import { AppError } from '../utils/AppError.js'

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    })
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError
  ) {
    console.error(error)

    return res.status(500).json({
      error: {
        code: 'DATA_LAYER_ERROR',
        message:
          'Hubo un problema al guardar o consultar datos. Si el error persiste, verificá migraciones y reinicio del backend.',
      },
    })
  }

  console.error(error)

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocurrió un error inesperado.',
    },
  })
}

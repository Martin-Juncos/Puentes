import { z } from 'zod'

import { idParamSchema, preprocessOptionalString } from '../../utils/validation.js'

export const createServiceSchema = {
  body: z.object({
    name: z.string().trim().min(3),
    description: z.string().trim().min(10),
    durationMinutes: z.coerce.number().int().min(15).max(180).optional(),
    colorTag: preprocessOptionalString(z.string().trim().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
}

export const updateServiceSchema = {
  params: idParamSchema,
  body: z
    .object({
      name: z.string().trim().min(3).optional(),
      description: z.string().trim().min(10).optional(),
      durationMinutes: z.coerce.number().int().min(15).max(180).optional(),
      colorTag: preprocessOptionalString(
        z.string().trim().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
      ),
      status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    })
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
      message: 'Debes enviar al menos un campo para actualizar.',
    }),
}

export const deleteServiceSchema = {
  params: idParamSchema,
}

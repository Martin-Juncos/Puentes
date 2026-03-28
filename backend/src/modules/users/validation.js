import { z } from 'zod'

import { idParamSchema, preprocessOptionalString } from '../../utils/validation.js'

export const createUserSchema = {
  body: z.object({
    fullName: z.string().trim().min(3),
    email: z.email().trim(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL']),
    phone: preprocessOptionalString(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
}

export const updateUserSchema = {
  params: idParamSchema,
  body: z
    .object({
      fullName: z.string().trim().min(3).optional(),
      email: z.email().trim().optional(),
      password: z.string().min(6).optional(),
      role: z.enum(['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL']).optional(),
      phone: preprocessOptionalString(),
      status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    })
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
      message: 'Debes enviar al menos un campo para actualizar.',
    }),
}

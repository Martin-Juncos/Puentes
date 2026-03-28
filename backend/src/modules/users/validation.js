import { z } from 'zod'

import { PROFESSIONAL_DISCIPLINES } from '../../utils/professionalDisciplines.js'
import { idParamSchema, preprocessOptionalString } from '../../utils/validation.js'

const professionalDisciplineSchema = z.enum(PROFESSIONAL_DISCIPLINES)

export const createUserSchema = {
  body: z
    .object({
      fullName: z.string().trim().min(3),
      email: z.email().trim(),
      password: z.string().min(6),
      role: z.enum(['ADMIN', 'COORDINATION', 'SECRETARY', 'PROFESSIONAL']),
      phone: preprocessOptionalString(),
      status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
      professionalDiscipline: preprocessOptionalString(professionalDisciplineSchema),
    })
    .superRefine((value, context) => {
      if (value.role === 'PROFESSIONAL' && !value.professionalDiscipline) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debes indicar el tipo de profesional.',
          path: ['professionalDiscipline'],
        })
      }

      if (value.role !== 'PROFESSIONAL' && value.professionalDiscipline) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El tipo profesional solo corresponde a usuarios profesionales.',
          path: ['professionalDiscipline'],
        })
      }
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
      professionalDiscipline: preprocessOptionalString(professionalDisciplineSchema),
    })
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
      message: 'Debes enviar al menos un campo para actualizar.',
    }),
}

export const deleteUserSchema = {
  params: idParamSchema,
}

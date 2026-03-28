import { z } from 'zod'

import { idParamSchema, preprocessOptionalString } from '../../utils/validation.js'

export const childBodySchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  birthDate: z.coerce.date(),
  familyId: z.string().trim().min(1),
  schoolName: preprocessOptionalString(),
  notes: preprocessOptionalString(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DISCHARGED']).optional(),
})

export const createChildSchema = {
  body: childBodySchema,
}

export const updateChildSchema = {
  params: idParamSchema,
  body: childBodySchema.partial(),
}

export const createAssignmentSchema = {
  params: idParamSchema,
  body: z.object({
    professionalId: z.string().trim().min(1),
    serviceId: z.string().trim().min(1).optional(),
    notes: preprocessOptionalString(),
  }),
}

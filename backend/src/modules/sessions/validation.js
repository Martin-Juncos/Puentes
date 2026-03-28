import { z } from 'zod'

import { idParamSchema, optionalDateSchema, preprocessOptionalString } from '../../utils/validation.js'

export const sessionQuerySchema = {
  query: z.object({
    childId: z.string().trim().min(1).optional(),
    professionalId: z.string().trim().min(1).optional(),
    serviceId: z.string().trim().min(1).optional(),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'RESCHEDULED']).optional(),
    startDate: optionalDateSchema,
    endDate: optionalDateSchema,
  }),
}

export const createSessionSchema = {
  body: z.object({
    childId: z.string().trim().min(1),
    professionalId: z.string().trim().min(1),
    serviceId: z.string().trim().min(1),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
    adminNotes: preprocessOptionalString(),
    internalNotes: preprocessOptionalString(),
  }),
}

export const updateSessionSchema = {
  params: idParamSchema,
  body: z
    .object({
      childId: z.string().trim().min(1).optional(),
      professionalId: z.string().trim().min(1).optional(),
      serviceId: z.string().trim().min(1).optional(),
      startsAt: z.coerce.date().optional(),
      endsAt: z.coerce.date().optional(),
      status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'RESCHEDULED']).optional(),
      adminNotes: preprocessOptionalString(),
      internalNotes: preprocessOptionalString(),
    })
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
      message: 'Debes enviar al menos un campo para actualizar.',
    }),
}

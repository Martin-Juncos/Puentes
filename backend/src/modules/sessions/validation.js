import { z } from 'zod'

import {
  idParamSchema,
  optionalDateSchema,
  optionalExplicitDateTimeSchema,
  preprocessNullableString,
  preprocessOptionalString,
  requiredExplicitDateTimeSchema,
} from '../../utils/validation.js'

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
    startsAt: requiredExplicitDateTimeSchema,
    endsAt: optionalExplicitDateTimeSchema,
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
      startsAt: optionalExplicitDateTimeSchema,
      endsAt: optionalExplicitDateTimeSchema,
      status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED', 'RESCHEDULED']).optional(),
      adminNotes: preprocessNullableString(),
      internalNotes: preprocessNullableString(),
    })
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
      message: 'Debes enviar al menos un campo para actualizar.',
    }),
}

export const deleteSessionSchema = {
  params: idParamSchema,
}

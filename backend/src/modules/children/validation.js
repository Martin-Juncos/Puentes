import { z } from 'zod'

import { idParamSchema, optionalDateSchema, preprocessOptionalString } from '../../utils/validation.js'

const validateCertificateDates = (value, context) => {
  if (
    value.disabilityCertificateIssuedAt &&
    value.disabilityCertificateExpiresAt &&
    value.disabilityCertificateExpiresAt < value.disabilityCertificateIssuedAt
  ) {
    context.addIssue({
      code: 'custom',
      path: ['disabilityCertificateExpiresAt'],
      message: 'La fecha de vencimiento no puede ser anterior a la fecha de emision.',
    })
  }
}

const childBodyBaseSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  birthDate: z.coerce.date(),
  familyId: z.string().trim().min(1),
  schoolName: preprocessOptionalString(),
  notes: preprocessOptionalString(),
  disabilityCertificateIssuedAt: optionalDateSchema,
  disabilityCertificateExpiresAt: optionalDateSchema,
  disabilityCertificateIssuedBy: preprocessOptionalString(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DISCHARGED']).optional(),
})

export const childBodySchema = childBodyBaseSchema.superRefine(validateCertificateDates)

export const createChildSchema = {
  body: childBodySchema,
}

export const updateChildSchema = {
  params: idParamSchema,
  body: childBodyBaseSchema.partial().superRefine(validateCertificateDates),
}

export const deleteChildSchema = {
  params: idParamSchema,
}

export const createAssignmentSchema = {
  params: idParamSchema,
  body: z.object({
    professionalId: z.string().trim().min(1),
    serviceId: z.string().trim().min(1).optional(),
    notes: preprocessOptionalString(),
  }),
}

import { z } from 'zod'

import { idParamSchema, preprocessOptionalString } from '../../utils/validation.js'

export const familyBodySchema = z.object({
  displayName: z.string().trim().min(3),
  primaryContactName: z.string().trim().min(3),
  primaryContactRelationship: z.string().trim().min(3),
  phone: z.string().trim().min(6),
  email: preprocessOptionalString(z.email().trim()),
  address: preprocessOptionalString(),
  notes: preprocessOptionalString(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

export const createFamilySchema = {
  body: familyBodySchema,
}

export const updateFamilySchema = {
  params: idParamSchema,
  body: familyBodySchema.partial(),
}

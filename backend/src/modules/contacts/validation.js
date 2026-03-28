import { z } from 'zod'

import { preprocessOptionalString } from '../../utils/validation.js'

export const createContactSchema = {
  body: z.object({
    fullName: z.string().trim().min(3),
    email: z.email().trim(),
    phone: preprocessOptionalString(),
    message: z.string().trim().min(10),
  }),
}

export const contactQuerySchema = {
  query: z.object({
    status: z.enum(['NEW', 'IN_REVIEW', 'RESOLVED']).optional(),
  }),
}

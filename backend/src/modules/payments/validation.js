import { z } from 'zod'

import { idParamSchema, optionalDateSchema, preprocessOptionalString } from '../../utils/validation.js'

export const paymentQuerySchema = {
  query: z.object({
    familyId: z.string().trim().min(1).optional(),
    childId: z.string().trim().min(1).optional(),
    status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  }),
}

export const paymentBodySchema = z.object({
  childId: z.string().trim().min(1),
  familyId: z.string().trim().min(1),
  sessionId: z.string().trim().min(1).optional(),
  amount: z.coerce.number().positive(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  paidAt: optionalDateSchema,
  dueDate: optionalDateSchema,
  notes: preprocessOptionalString(),
})

export const createPaymentSchema = {
  body: paymentBodySchema,
}

export const updatePaymentSchema = {
  params: idParamSchema,
  body: paymentBodySchema.partial(),
}

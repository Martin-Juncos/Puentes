import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.string().trim().min(1),
})

export const preprocessOptionalString = (schema = z.string().trim()) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

export const optionalDateSchema = z.preprocess(
  (value) => (value ? new Date(value) : undefined),
  z.date().optional(),
)

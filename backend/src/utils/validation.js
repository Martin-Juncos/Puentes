import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.string().trim().min(1),
})

export const preprocessOptionalString = (schema = z.string().trim()) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

export const preprocessNullableString = (schema = z.string().trim()) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable().optional())

export const optionalDateSchema = z.preprocess(
  (value) => (value ? new Date(value) : undefined),
  z.date().optional(),
)

export const stripHtmlToText = (value = '') =>
  value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|ul|ol|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const parseDateInput = (value) => {
  if (!value || typeof value !== 'string') {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
}

export const requiredDateInputSchema = z.preprocess(
  (value) => parseDateInput(value),
  z.date({
    error: 'Debes seleccionar una fecha válida.',
  }),
)

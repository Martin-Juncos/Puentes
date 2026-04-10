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

const explicitDateTimeOffsetPattern = /(Z|[+-]\d{2}:\d{2})$/
const invalidDate = new Date(Number.NaN)

const parseExplicitDateTime = (value) => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }

  if (typeof value !== 'string') {
    return value
  }

  const normalizedValue = value.trim()

  if (!normalizedValue || !explicitDateTimeOffsetPattern.test(normalizedValue)) {
    return undefined
  }

  const parsedDate = new Date(normalizedValue)

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate
}

export const requiredExplicitDateTimeSchema = z.preprocess(
  (value) => parseExplicitDateTime(value) ?? invalidDate,
  z.date({
    error: 'Debes enviar una fecha y hora válida con zona horaria explícita.',
  }),
)

export const optionalExplicitDateTimeSchema = z.preprocess(
  (value) => {
    if (value === '' || value === undefined) {
      return undefined
    }

    return parseExplicitDateTime(value) ?? invalidDate
  },
  z
    .date({
      error: 'Debes enviar una fecha y hora válida con zona horaria explícita.',
    })
    .optional(),
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

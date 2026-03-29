import { z } from 'zod'

import {
  idParamSchema,
  preprocessNullableString,
  preprocessOptionalString,
  requiredDateInputSchema,
  stripHtmlToText,
} from '../../utils/validation.js'

const followUpNoteSchema = z.string().trim().superRefine((value, context) => {
  if (stripHtmlToText(value).length < 10) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'La nota debe tener al menos 10 caracteres.',
    })
  }
})

export const followUpQuerySchema = {
  query: z.object({
    childId: z.string().trim().min(1).optional(),
    professionalId: z.string().trim().min(1).optional(),
    sessionId: z.string().trim().min(1).optional(),
  }),
}

export const createFollowUpSchema = {
  body: z.object({
    childId: z.string().trim().min(1),
    professionalId: z.string().trim().min(1).optional(),
    sessionId: z.string().trim().min(1).optional(),
    followUpDate: requiredDateInputSchema,
    title: preprocessOptionalString(),
    summary: preprocessOptionalString(),
    note: followUpNoteSchema,
  }),
}

export const updateFollowUpSchema = {
  params: idParamSchema,
  body: z.object({
    childId: z.string().trim().min(1),
    professionalId: z.string().trim().min(1).optional(),
    followUpDate: requiredDateInputSchema,
    title: preprocessNullableString(),
    summary: preprocessNullableString(),
    note: followUpNoteSchema,
  }),
}

export const deleteFollowUpSchema = {
  params: idParamSchema,
}

export const getFollowUpSchema = {
  params: idParamSchema,
}

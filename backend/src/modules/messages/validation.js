import { z } from 'zod'

import { idParamSchema, preprocessOptionalString, stripHtmlToText } from '../../utils/validation.js'

const messageContextTypeSchema = z.enum(['CONSULTA', 'REPORTE', 'INFORMACION'])
const optionalMessageContextTypeSchema = z.preprocess(
  (value) => (value === '' ? undefined : value),
  messageContextTypeSchema.optional(),
)

const messageBodySchema = z.string().trim().superRefine((value, context) => {
  if (stripHtmlToText(value).length < 2) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El mensaje debe tener al menos 2 caracteres.',
    })
  }
})

export const messageThreadsQuerySchema = {
  query: z.object({
    childId: preprocessOptionalString(z.string().trim().min(1)),
  }),
}

export const messageRecipientsQuerySchema = {
  query: z
    .object({
      childId: preprocessOptionalString(z.string().trim().min(1)),
      contextType: optionalMessageContextTypeSchema,
    })
    .superRefine((value, context) => {
      if (!value.childId && !value.contextType) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debes indicar un caso o un tipo de conversación general.',
          path: ['childId'],
        })
      }
    }),
}

export const getMessageThreadSchema = {
  params: idParamSchema,
}

export const createMessageThreadSchema = {
  body: z
    .object({
      childId: preprocessOptionalString(z.string().trim().min(1)),
      contextType: optionalMessageContextTypeSchema,
      subject: z.string().trim().min(3, 'El asunto debe tener al menos 3 caracteres.').max(160),
      participantUserIds: z.array(z.string().trim().min(1)).min(1, 'Debes seleccionar al menos un destinatario.'),
      priority: z.enum(['NORMAL', 'HIGH']).default('NORMAL'),
      initialMessage: messageBodySchema,
    })
    .superRefine((value, context) => {
      if (!value.childId && !value.contextType) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debes seleccionar un caso o una conversación general.',
          path: ['childId'],
        })
      }

      if (value.childId && value.contextType) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No puedes enviar un caso y un tipo general al mismo tiempo.',
          path: ['contextType'],
        })
      }
    }),
}

export const createMessageSchema = {
  params: idParamSchema,
  body: z.object({
    body: messageBodySchema,
  }),
}

export const markThreadReadSchema = {
  params: idParamSchema,
}

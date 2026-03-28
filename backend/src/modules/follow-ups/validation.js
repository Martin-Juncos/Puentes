import { z } from 'zod'

import { preprocessOptionalString } from '../../utils/validation.js'

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
    title: preprocessOptionalString(),
    note: z.string().trim().min(10),
  }),
}

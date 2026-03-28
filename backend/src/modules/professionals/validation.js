import { z } from 'zod'

import { preprocessOptionalString } from '../../utils/validation.js'

export const upsertProfessionalSchema = {
  body: z.object({
    userId: z.string().trim().min(1),
    discipline: z.string().trim().min(2),
    bio: preprocessOptionalString(),
    calendarColor: preprocessOptionalString(z.string().trim().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)),
    isHighlighted: z.boolean().optional(),
  }),
}

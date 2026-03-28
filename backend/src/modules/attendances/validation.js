import { z } from 'zod'

import { preprocessOptionalString } from '../../utils/validation.js'

export const attendanceQuerySchema = {
  query: z.object({
    status: z.enum(['PENDING', 'PRESENT', 'ABSENT', 'RESCHEDULED', 'CANCELED']).optional(),
    sessionId: z.string().trim().min(1).optional(),
  }),
}

export const upsertAttendanceSchema = {
  body: z.object({
    sessionId: z.string().trim().min(1),
    status: z.enum(['PENDING', 'PRESENT', 'ABSENT', 'RESCHEDULED', 'CANCELED']),
    notes: preprocessOptionalString(),
  }),
}

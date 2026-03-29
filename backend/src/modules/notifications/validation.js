import { z } from 'zod'

import { idParamSchema } from '../../utils/validation.js'

export const notificationsQuerySchema = {
  query: z.object({
    limit: z.coerce.number().int().min(1).max(30).optional(),
  }),
}

export const readNotificationSchema = {
  params: idParamSchema,
}

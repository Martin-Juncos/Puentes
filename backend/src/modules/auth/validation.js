import { z } from 'zod'

export const loginSchema = {
  body: z.object({
    email: z.email().trim(),
    password: z.string().min(6),
  }),
}

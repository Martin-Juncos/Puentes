import { z } from 'zod'

import { preprocessOptionalString } from '../../utils/validation.js'

export const createContactSchema = {
  body: z.object({
    fullName: z.string().trim().min(3, 'El nombre y apellido debe tener al menos 3 caracteres.'),
    email: z.string().trim().email('Ingresá un email válido.'),
    phone: preprocessOptionalString(),
    message: z.string().trim().min(10, 'El mensaje debe tener al menos 10 caracteres.'),
  }),
}

export const contactQuerySchema = {
  query: z.object({
    status: z.enum(['NEW', 'IN_REVIEW', 'RESOLVED']).optional(),
  }),
}

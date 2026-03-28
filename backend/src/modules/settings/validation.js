import { z } from 'zod'

export const updateSettingsSchema = {
  body: z
    .object({
      centerName: z.string().trim().min(2).max(120).optional(),
      institutionalEmail: z.string().trim().email().max(120).optional(),
      institutionalPhone: z.string().trim().min(6).max(40).optional(),
      whatsappUrl: z.string().trim().url().max(300).optional(),
      address: z.string().trim().min(4).max(200).optional(),
      businessHoursSummary: z.string().trim().min(4).max(160).optional(),
      defaultServiceDurationMinutes: z.coerce.number().int().min(15).max(180).optional(),
      defaultSessionDurationMinutes: z.coerce.number().int().min(15).max(180).optional(),
      slotIntervalMinutes: z.coerce.number().int().min(15).max(120).optional(),
    })
    .refine((value) => Object.values(value).some((field) => field !== undefined), {
      message: 'Debes enviar al menos un campo para actualizar.',
    }),
}

import { describe, expect, it } from 'vitest'

import { createSessionSchema, updateSessionSchema } from './validation.js'

const validCreatePayload = {
  childId: 'child-1',
  professionalId: 'professional-1',
  serviceId: 'service-1',
  startsAt: '2026-04-10T18:00:00.000Z',
  endsAt: '2026-04-10T18:45:00.000Z',
}

describe('session validation', () => {
  it('acepta datetimes con zona horaria explicita', () => {
    const result = createSessionSchema.body.safeParse(validCreatePayload)

    expect(result.success).toBe(true)
    expect(result.data.startsAt.toISOString()).toBe('2026-04-10T18:00:00.000Z')
    expect(result.data.endsAt.toISOString()).toBe('2026-04-10T18:45:00.000Z')
  })

  it('rechaza datetimes ambiguos sin zona horaria', () => {
    const result = createSessionSchema.body.safeParse({
      ...validCreatePayload,
      startsAt: '2026-04-10T15:00',
      endsAt: '2026-04-10T15:45',
    })

    expect(result.success).toBe(false)
    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['startsAt'],
          message: 'Debes enviar una fecha y hora válida con zona horaria explícita.',
        }),
        expect.objectContaining({
          path: ['endsAt'],
          message: 'Debes enviar una fecha y hora válida con zona horaria explícita.',
        }),
      ]),
    )
  })

  it('mantiene opcionales los datetimes al actualizar si no se envian', () => {
    const result = updateSessionSchema.body.safeParse({
      status: 'CANCELED',
    })

    expect(result.success).toBe(true)
    expect(result.data.startsAt).toBeUndefined()
    expect(result.data.endsAt).toBeUndefined()
  })
})

import { describe, expect, it } from 'vitest'

import {
  buildEndsAtValue,
  buildSessionPayload,
  toApiDateTimeValue,
  toDateTimeLocalValue,
} from './sessionAgendaUtils'

describe('sessionAgendaUtils', () => {
  it('convierte datetime-local a ISO sin perder la hora elegida localmente', () => {
    const value = '2026-04-10T15:00'

    expect(new Date(toApiDateTimeValue(value)).getTime()).toBe(new Date(2026, 3, 10, 15, 0, 0, 0).getTime())
  })

  it('calcula endsAt en ISO manteniendo la duracion elegida', () => {
    const endsAt = buildEndsAtValue('2026-04-10T15:00', '45')

    expect(new Date(endsAt).getTime()).toBe(new Date(2026, 3, 10, 15, 45, 0, 0).getTime())
  })

  it('arma el payload de sesion con fechas ISO y puede reconstruir el valor del input local', () => {
    const payload = buildSessionPayload({
      childId: 'child-1',
      professionalId: 'professional-1',
      serviceId: 'service-1',
      startsAt: '2026-04-10T15:00',
      durationMinutes: '45',
      adminNotes: 'nota',
      internalNotes: 'interna',
    })

    expect(payload.startsAt).toMatch(/Z$/)
    expect(payload.endsAt).toMatch(/Z$/)
    expect(toDateTimeLocalValue(payload.startsAt)).toBe('2026-04-10T15:00')
    expect(toDateTimeLocalValue(payload.endsAt)).toBe('2026-04-10T15:45')
  })
})

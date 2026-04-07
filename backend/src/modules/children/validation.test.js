import { describe, expect, it } from 'vitest'

import { childBodySchema } from './validation.js'

const validChildPayload = {
  firstName: 'Mateo',
  lastName: 'Perez',
  birthDate: '2020-05-10',
  familyId: 'family-1',
  schoolName: 'Escuela 12',
  notes: 'Seguimiento inicial',
}

describe('childBodySchema', () => {
  it('acepta los campos opcionales del certificado vacios', () => {
    const result = childBodySchema.safeParse({
      ...validChildPayload,
      disabilityCertificateIssuedAt: '',
      disabilityCertificateExpiresAt: '',
    })

    expect(result.success).toBe(true)
    expect(result.data.disabilityCertificateIssuedAt).toBeUndefined()
    expect(result.data.disabilityCertificateExpiresAt).toBeUndefined()
  })

  it('normaliza emitido por vacio a undefined', () => {
    const result = childBodySchema.safeParse({
      ...validChildPayload,
      disabilityCertificateIssuedBy: '',
    })

    expect(result.success).toBe(true)
    expect(result.data.disabilityCertificateIssuedBy).toBeUndefined()
  })

  it('rechaza una fecha de vencimiento anterior a la de emision', () => {
    const result = childBodySchema.safeParse({
      ...validChildPayload,
      disabilityCertificateIssuedAt: '2026-05-10',
      disabilityCertificateExpiresAt: '2026-05-09',
      disabilityCertificateIssuedBy: 'Junta Medica Provincial',
    })

    expect(result.success).toBe(false)
    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['disabilityCertificateExpiresAt'],
          message: 'La fecha de vencimiento no puede ser anterior a la fecha de emision.',
        }),
      ]),
    )
  })
})

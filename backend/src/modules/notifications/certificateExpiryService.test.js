import { beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMocks = vi.hoisted(() => ({
  childFindMany: vi.fn(),
  userFindMany: vi.fn(),
  notificationCreateMany: vi.fn(),
}))

vi.mock('../../db/prisma.js', () => ({
  prisma: {
    child: {
      findMany: prismaMocks.childFindMany,
    },
    user: {
      findMany: prismaMocks.userFindMany,
    },
    notification: {
      createMany: prismaMocks.notificationCreateMany,
    },
  },
}))

import {
  buildCertificateExpiryDedupeKey,
  listChildrenWithCertificateExpiringSoon,
  syncExpiringCertificateNotifications,
} from './certificateExpiryService.js'

describe('certificateExpiryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('consulta solo casos activos o en pausa dentro de los proximos 90 dias', async () => {
    prismaMocks.childFindMany.mockResolvedValue([])

    await listChildrenWithCertificateExpiringSoon(new Date('2026-04-07T12:00:00.000Z'))

    expect(prismaMocks.childFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: {
            in: ['ACTIVE', 'PAUSED'],
          },
          disabilityCertificateExpiresAt: expect.objectContaining({
            gte: new Date('2026-04-07T00:00:00.000Z'),
            lte: new Date('2026-07-06T23:59:59.999Z'),
          }),
        }),
      }),
    )
  })

  it('crea una sola tanda de alertas para coordinacion, secretaria y profesionales asignados activos', async () => {
    prismaMocks.childFindMany.mockResolvedValue([
      {
        id: 'child-1',
        firstName: 'Mateo',
        lastName: 'Perez',
        disabilityCertificateExpiresAt: new Date('2026-05-10T00:00:00.000Z'),
        assignments: [
          {
            professional: {
              user: {
                id: 'professional-user-1',
                status: 'ACTIVE',
              },
            },
          },
          {
            professional: {
              user: {
                id: 'professional-user-2',
                status: 'INACTIVE',
              },
            },
          },
        ],
      },
    ])
    prismaMocks.userFindMany.mockResolvedValue([
      { id: 'coord-user-1' },
      { id: 'secretary-user-1' },
    ])
    prismaMocks.notificationCreateMany.mockResolvedValue({ count: 3 })

    const result = await syncExpiringCertificateNotifications(new Date('2026-04-07T12:00:00.000Z'))

    expect(prismaMocks.userFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'ACTIVE',
          role: {
            in: ['COORDINATION', 'SECRETARY'],
          },
        },
      }),
    )
    expect(prismaMocks.notificationCreateMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          userId: 'coord-user-1',
          type: 'CHILD_CERTIFICATE_EXPIRING',
          childId: 'child-1',
          dedupeKey: 'certificate-expiry:child-1:2026-05-10',
          title: 'Certificado proximo a vencer',
        }),
        expect.objectContaining({
          userId: 'secretary-user-1',
          type: 'CHILD_CERTIFICATE_EXPIRING',
          childId: 'child-1',
          dedupeKey: 'certificate-expiry:child-1:2026-05-10',
        }),
        expect.objectContaining({
          userId: 'professional-user-1',
          type: 'CHILD_CERTIFICATE_EXPIRING',
          childId: 'child-1',
          dedupeKey: 'certificate-expiry:child-1:2026-05-10',
        }),
      ]),
      skipDuplicates: true,
    })
    expect(result).toEqual({
      scannedChildren: 1,
      queuedNotifications: 3,
      createdNotifications: 3,
    })
  })

  it('no crea alertas cuando no hay certificados dentro de la ventana', async () => {
    prismaMocks.childFindMany.mockResolvedValue([])
    prismaMocks.userFindMany.mockResolvedValue([{ id: 'coord-user-1' }])

    const result = await syncExpiringCertificateNotifications(new Date('2026-04-07T12:00:00.000Z'))

    expect(prismaMocks.notificationCreateMany).not.toHaveBeenCalled()
    expect(result).toEqual({
      scannedChildren: 0,
      queuedNotifications: 0,
      createdNotifications: 0,
    })
  })

  it('genera una dedupe key distinta si cambia la fecha de vencimiento', () => {
    expect(
      buildCertificateExpiryDedupeKey('child-1', new Date('2026-05-10T00:00:00.000Z')),
    ).not.toBe(
      buildCertificateExpiryDedupeKey('child-1', new Date('2026-06-10T00:00:00.000Z')),
    )
  })
})

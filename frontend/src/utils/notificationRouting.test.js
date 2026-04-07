import { describe, expect, it } from 'vitest'

import { getNotificationNavigationTarget } from './notificationRouting'

describe('getNotificationNavigationTarget', () => {
  it('dirige alertas de certificado al caso en niños', () => {
    expect(
      getNotificationNavigationTarget({
        canUseMessaging: true,
        notification: {
          type: 'CHILD_CERTIFICATE_EXPIRING',
          childId: 'child-1',
        },
      }),
    ).toBe('/app/ninos?childId=child-1')
  })

  it('mantiene la navegación actual para mensajes cuando no es alerta de certificado', () => {
    expect(
      getNotificationNavigationTarget({
        canUseMessaging: true,
        notification: {
          type: 'MESSAGE_NEW',
          threadId: 'thread-1',
        },
      }),
    ).toBe('/app/mensajes?threadId=thread-1')
  })

  it('cae al dashboard si no puede usar mensajería y no es alerta de certificado', () => {
    expect(
      getNotificationNavigationTarget({
        canUseMessaging: false,
        notification: {
          type: 'THREAD_ASSIGNED',
        },
      }),
    ).toBe('/app/dashboard')
  })
})

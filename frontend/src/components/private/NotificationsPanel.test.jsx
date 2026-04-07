import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NotificationsPanel } from './NotificationsPanel'

describe('NotificationsPanel', () => {
  it('renderiza alertas de certificado proximo a vencer', () => {
    render(
      <NotificationsPanel
        error=""
        isLoading={false}
        notifications={[
          {
            id: 'notification-1',
            type: 'CHILD_CERTIFICATE_EXPIRING',
            title: 'Certificado proximo a vencer',
            bodyPreview: 'El certificado de Mateo Perez vence el 10/05/2026.',
            isRead: false,
            readAt: null,
            child: {
              firstName: 'Mateo',
              lastName: 'Perez',
            },
            actorUser: null,
            createdAt: '2026-04-07T12:00:00.000Z',
          },
        ]}
        onMarkAllRead={vi.fn()}
        onMarkRead={vi.fn()}
        onOpenNotification={vi.fn()}
        unreadCount={1}
      />,
    )

    expect(screen.getByText('Certificado proximo a vencer')).toBeInTheDocument()
    expect(screen.getByText('El certificado de Mateo Perez vence el 10/05/2026.')).toBeInTheDocument()
    expect(screen.getByText('Mateo Perez')).toBeInTheDocument()
  })
})

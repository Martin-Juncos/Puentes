import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PANEL_NOTIFICATIONS_SYNC_EVENT } from '@/utils/panelEvents'

const notificationsServiceMocks = vi.hoisted(() => ({
  getUnreadCount: vi.fn(),
  list: vi.fn(),
  markRead: vi.fn(),
  markAllRead: vi.fn(),
}))

vi.mock('@/hooks/usePolling', () => ({
  usePolling: vi.fn(),
}))

vi.mock('@/services/notificationsService', () => ({
  notificationsService: notificationsServiceMocks,
}))

import { usePanelNotifications } from './usePanelNotifications'

describe('usePanelNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sincroniza contador y lista cuando se abre el panel', async () => {
    notificationsServiceMocks.getUnreadCount.mockResolvedValue({ unreadCount: 3 })
    notificationsServiceMocks.list.mockResolvedValue([
      { id: 'n1', title: 'Nueva alerta', isRead: false, readAt: null },
    ])

    const { result } = renderHook(() => usePanelNotifications({ enabled: true }))

    await waitFor(() => expect(result.current.unreadCount).toBe(3))

    expect(result.current.notifications).toEqual([])

    await act(async () => {
      result.current.toggle()
    })

    await waitFor(() =>
      expect(notificationsServiceMocks.list).toHaveBeenCalledWith(10),
    )

    expect(result.current.isOpen).toBe(true)
    expect(result.current.notifications).toEqual([
      { id: 'n1', title: 'Nueva alerta', isRead: false, readAt: null },
    ])
  })

  it('resetea el estado al deshabilitarse y responde al evento global de sync', async () => {
    notificationsServiceMocks.getUnreadCount.mockResolvedValue({ unreadCount: 1 })
    notificationsServiceMocks.list.mockResolvedValue([
      { id: 'n2', title: 'Recordatorio', isRead: false, readAt: null },
    ])

    const { result, rerender } = renderHook(
      ({ enabled }) => usePanelNotifications({ enabled }),
      {
        initialProps: { enabled: true },
      },
    )

    await waitFor(() => expect(result.current.unreadCount).toBe(1))

    await act(async () => {
      result.current.toggle()
    })

    await waitFor(() => expect(result.current.notifications).toHaveLength(1))

    const unreadCountCallsBeforeSync = notificationsServiceMocks.getUnreadCount.mock.calls.length

    act(() => {
      window.dispatchEvent(new Event(PANEL_NOTIFICATIONS_SYNC_EVENT))
    })

    await waitFor(() =>
      expect(notificationsServiceMocks.getUnreadCount.mock.calls.length).toBeGreaterThan(
        unreadCountCallsBeforeSync,
      ),
    )

    rerender({ enabled: false })

    await waitFor(() => expect(result.current.isOpen).toBe(false))

    expect(result.current.notifications).toEqual([])
    expect(result.current.unreadCount).toBe(0)
  })
})

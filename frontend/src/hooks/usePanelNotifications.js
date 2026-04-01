import { useCallback, useEffect, useState } from 'react'

import { usePolling } from '@/hooks/usePolling'
import { notificationsService } from '@/services/notificationsService'
import { emitNotificationsSync, PANEL_NOTIFICATIONS_SYNC_EVENT } from '@/utils/panelEvents'

export const usePanelNotifications = ({ enabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const syncNotifications = useCallback(async ({ includeList = false, silent = false } = {}) => {
    if (!enabled) {
      return
    }

    if (includeList && !silent) {
      setIsLoading(true)
    }

    try {
      const [countResult, notificationsResult] = await Promise.all([
        notificationsService.getUnreadCount(),
        includeList ? notificationsService.list(10) : Promise.resolve(null),
      ])

      setUnreadCount(countResult.unreadCount ?? 0)

      if (notificationsResult) {
        setNotifications(notificationsResult)
      }

      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      if (includeList && !silent) {
        setIsLoading(false)
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setNotifications([])
      setUnreadCount(0)
      setIsOpen(false)
      return
    }

    void syncNotifications({ includeList: isOpen })
  }, [enabled, isOpen, syncNotifications])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleSync = () => {
      void syncNotifications({ includeList: isOpen, silent: true })
    }

    window.addEventListener(PANEL_NOTIFICATIONS_SYNC_EVENT, handleSync)

    return () => {
      window.removeEventListener(PANEL_NOTIFICATIONS_SYNC_EVENT, handleSync)
    }
  }, [enabled, isOpen, syncNotifications])

  usePolling(
    () => syncNotifications({ includeList: isOpen, silent: true }),
    {
      enabled,
      intervalMs: 30000,
    },
  )

  const toggle = useCallback(() => {
    const nextValue = !isOpen
    setIsOpen(nextValue)

    if (nextValue) {
      void syncNotifications({ includeList: true })
    }
  }, [isOpen, syncNotifications])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const markRead = useCallback(async (notificationId) => {
    try {
      const updatedNotification = await notificationsService.markRead(notificationId)

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId ? updatedNotification : notification,
        ),
      )
      setUnreadCount((current) => Math.max(0, current - 1))
      emitNotificationsSync()
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await notificationsService.markAllRead()
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt ?? new Date().toISOString(),
        })),
      )
      setUnreadCount(0)
      emitNotificationsSync()
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  return {
    close,
    error,
    isLoading,
    isOpen,
    markAllRead,
    markRead,
    notifications,
    syncNotifications,
    toggle,
    unreadCount,
  }
}

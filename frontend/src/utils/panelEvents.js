export const PANEL_NOTIFICATIONS_SYNC_EVENT = 'puentes:notifications-sync'

export const emitNotificationsSync = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(PANEL_NOTIFICATIONS_SYNC_EVENT))
}

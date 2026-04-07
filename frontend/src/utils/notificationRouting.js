export const getNotificationNavigationTarget = ({ canUseMessaging, notification }) => {
  if (notification.type === 'CHILD_CERTIFICATE_EXPIRING' && notification.childId) {
    return `/app/ninos?childId=${notification.childId}`
  }

  if (!canUseMessaging) {
    return '/app/dashboard'
  }

  if (notification.threadId) {
    return `/app/mensajes?threadId=${notification.threadId}`
  }

  if (notification.childId) {
    return `/app/mensajes?childId=${notification.childId}&compose=1`
  }

  return '/app/mensajes'
}

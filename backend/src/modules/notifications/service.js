import { prisma } from '../../db/prisma.js'
import { AppError } from '../../utils/AppError.js'
import { notificationSelect } from '../../utils/recordSelects.js'

import { countUnreadNotifications, getNotification, listNotifications } from './repository.js'

const normalizeNotification = (notification) => ({
  ...notification,
  isRead: Boolean(notification.readAt),
})

export const getNotifications = async (filters, user) => {
  const notifications = await listNotifications({
    userId: user.id,
    limit: filters.limit,
  })

  return notifications.map(normalizeNotification)
}

export const getUnreadNotificationsCount = async (user) => ({
  unreadCount: await countUnreadNotifications(user.id),
})

export const markNotificationAsRead = async (id, user) => {
  const notification = await getNotification({
    id,
    userId: user.id,
  })

  if (!notification) {
    throw new AppError(404, 'NOTIFICATION_NOT_FOUND', 'No se encontró la notificación indicada.')
  }

  if (notification.readAt) {
    return normalizeNotification(notification)
  }

  return normalizeNotification(
    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        readAt: new Date(),
      },
      select: notificationSelect,
    }),
  )
}

export const markAllNotificationsAsRead = async (user) => {
  const readAt = new Date()
  const result = await prisma.notification.updateMany({
    where: {
      userId: user.id,
      readAt: null,
    },
    data: {
      readAt,
    },
  })

  return {
    success: true,
    readCount: result.count,
    readAt,
  }
}

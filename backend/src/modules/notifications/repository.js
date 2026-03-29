import { prisma } from '../../db/prisma.js'
import { notificationSelect } from '../../utils/recordSelects.js'

export const listNotifications = ({ userId, limit = 12 }) =>
  prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: [{ createdAt: 'desc' }],
    take: limit,
    select: notificationSelect,
  })

export const countUnreadNotifications = (userId) =>
  prisma.notification.count({
    where: {
      userId,
      readAt: null,
    },
  })

export const getNotification = ({ id, userId }) =>
  prisma.notification.findFirst({
    where: {
      id,
      userId,
    },
    select: notificationSelect,
  })

import { sendSuccess } from '../../utils/response.js'

import {
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './service.js'

export const listNotificationsController = async (req, res) =>
  sendSuccess(res, await getNotifications(req.query, req.user))

export const getUnreadNotificationsCountController = async (req, res) =>
  sendSuccess(res, await getUnreadNotificationsCount(req.user))

export const markNotificationReadController = async (req, res) =>
  sendSuccess(res, await markNotificationAsRead(req.params.id, req.user))

export const markAllNotificationsReadController = async (_req, res) =>
  sendSuccess(res, await markAllNotificationsAsRead(_req.user))

import { apiClient } from './http/client'

export const notificationsService = {
  list: (limit = 12) => apiClient.get(`/notifications?limit=${limit}`),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markRead: (id) => apiClient.post(`/notifications/${id}/read`, {}),
  markAllRead: () => apiClient.post('/notifications/read-all', {}),
}

import { apiClient } from './http/client'

const buildQuery = (filters = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()

  return query ? `?${query}` : ''
}

const buildThreadPayload = (payload = {}) => ({
  subject: payload.subject,
  priority: payload.priority,
  participantUserIds: payload.participantUserIds,
  initialMessage: payload.initialMessage,
  ...(payload.childId ? { childId: payload.childId } : {}),
  ...(payload.contextType ? { contextType: payload.contextType } : {}),
})

export const messagesService = {
  list: (filters = {}) => apiClient.get(`/messages/threads${buildQuery(filters)}`),
  listRecipients: (filters = {}) => apiClient.get(`/messages/recipients${buildQuery(filters)}`),
  getById: (id) => apiClient.get(`/messages/threads/${id}`),
  create: (payload) => apiClient.post('/messages/threads', buildThreadPayload(payload)),
  createMessage: (id, payload) => apiClient.post(`/messages/threads/${id}/messages`, payload),
  markAsRead: (id) => apiClient.post(`/messages/threads/${id}/read`, {}),
}

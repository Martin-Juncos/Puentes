import { apiClient } from './http/client'

export const followUpsService = {
  list: () => apiClient.get('/follow-ups'),
  getById: (id) => apiClient.get(`/follow-ups/${id}`),
  create: (payload) => apiClient.post('/follow-ups', payload),
  update: (id, payload) => apiClient.patch(`/follow-ups/${id}`, payload),
  remove: (id) => apiClient.delete(`/follow-ups/${id}`),
}

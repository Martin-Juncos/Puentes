import { apiClient } from './http/client'

export const familiesService = {
  list: () => apiClient.get('/families'),
  create: (payload) => apiClient.post('/families', payload),
  update: (id, payload) => apiClient.patch(`/families/${id}`, payload),
  remove: (id) => apiClient.delete(`/families/${id}`),
}

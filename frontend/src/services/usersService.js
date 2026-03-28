import { apiClient } from './http/client'

export const usersService = {
  list: () => apiClient.get('/users'),
  create: (payload) => apiClient.post('/users', payload),
  update: (id, payload) => apiClient.patch(`/users/${id}`, payload),
  remove: (id) => apiClient.delete(`/users/${id}`),
}

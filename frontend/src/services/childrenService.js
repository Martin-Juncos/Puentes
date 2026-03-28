import { apiClient } from './http/client'

export const childrenService = {
  list: () => apiClient.get('/children'),
  create: (payload) => apiClient.post('/children', payload),
  update: (id, payload) => apiClient.patch(`/children/${id}`, payload),
  assignProfessional: (id, payload) => apiClient.post(`/children/${id}/assignments`, payload),
}

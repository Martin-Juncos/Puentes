import { apiClient } from './http/client'

export const childrenService = {
  list: () => apiClient.get('/children'),
  create: (payload) => apiClient.post('/children', payload),
  update: (id, payload) => apiClient.patch(`/children/${id}`, payload),
  remove: (id) => apiClient.delete(`/children/${id}`),
  assignProfessional: (id, payload) => apiClient.post(`/children/${id}/assignments`, payload),
  clearAssignments: (id) => apiClient.delete(`/children/${id}/assignments`),
}

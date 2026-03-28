import { apiClient } from './http/client'

export const servicesService = {
  listPublic: () => apiClient.get('/services'),
  listManage: () => apiClient.get('/services/manage'),
  create: (payload) => apiClient.post('/services', payload),
  update: (id, payload) => apiClient.patch(`/services/${id}`, payload),
  remove: (id) => apiClient.delete(`/services/${id}`),
}

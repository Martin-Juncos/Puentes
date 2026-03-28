import { apiClient } from './http/client'

export const paymentsService = {
  list: () => apiClient.get('/payments'),
  create: (payload) => apiClient.post('/payments', payload),
  update: (id, payload) => apiClient.patch(`/payments/${id}`, payload),
}

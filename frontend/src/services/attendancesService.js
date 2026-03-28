import { apiClient } from './http/client'

export const attendancesService = {
  list: () => apiClient.get('/attendances'),
  upsert: (payload) => apiClient.post('/attendances', payload),
}

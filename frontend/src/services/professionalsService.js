import { apiClient } from './http/client'

export const professionalsService = {
  listPublic: () => apiClient.get('/professionals'),
  listManage: () => apiClient.get('/professionals/manage'),
  upsert: (payload) => apiClient.post('/professionals', payload),
}

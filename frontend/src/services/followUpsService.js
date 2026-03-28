import { apiClient } from './http/client'

export const followUpsService = {
  list: () => apiClient.get('/follow-ups'),
  create: (payload) => apiClient.post('/follow-ups', payload),
}

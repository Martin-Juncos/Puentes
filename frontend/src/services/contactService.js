import { apiClient } from './http/client'

export const contactService = {
  create: (payload) => apiClient.post('/contacts', payload),
  list: (status) => apiClient.get(`/contacts${status ? `?status=${status}` : ''}`),
}

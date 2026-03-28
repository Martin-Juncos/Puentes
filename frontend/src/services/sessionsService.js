import { apiClient } from './http/client'

export const sessionsService = {
  list: (params = {}) => {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        query.set(key, value)
      }
    })

    return apiClient.get(`/sessions${query.size ? `?${query.toString()}` : ''}`)
  },
  create: (payload) => apiClient.post('/sessions', payload),
  update: (id, payload) => apiClient.patch(`/sessions/${id}`, payload),
}

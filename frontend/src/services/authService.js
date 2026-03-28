import { apiClient } from './http/client'

export const authService = {
  login: (payload) => apiClient.post('/auth/login', payload),
  logout: () => apiClient.post('/auth/logout', {}),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

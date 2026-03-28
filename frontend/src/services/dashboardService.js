import { apiClient } from './http/client'

export const dashboardService = {
  getSummary: () => apiClient.get('/dashboard'),
}

import { apiClient } from './http/client'

export const settingsService = {
  getPublic: () => apiClient.get('/settings'),
  getManage: () => apiClient.get('/settings/manage'),
  updateManage: (payload) => apiClient.patch('/settings/manage', payload),
}

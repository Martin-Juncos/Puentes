import { APP_SETTINGS_ID, DEFAULT_APP_SETTINGS } from '../../config/defaultAppSettings.js'

import { upsertSettings } from './repository.js'

const ensureSettings = async () => upsertSettings(APP_SETTINGS_ID, DEFAULT_APP_SETTINGS)

export const getPublicSettings = async () => {
  const settings = await ensureSettings()

  return {
    centerName: settings.centerName,
    institutionalEmail: settings.institutionalEmail,
    institutionalPhone: settings.institutionalPhone,
    whatsappUrl: settings.whatsappUrl,
    address: settings.address,
    businessHoursSummary: settings.businessHoursSummary,
  }
}

export const getManageSettings = async () => ensureSettings()

export const updateManageSettings = async (payload) =>
  upsertSettings(APP_SETTINGS_ID, DEFAULT_APP_SETTINGS, payload)

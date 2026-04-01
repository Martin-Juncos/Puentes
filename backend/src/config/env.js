import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../../.env'), quiet: true })
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true, quiet: true })

const parseCsv = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const toBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback
  }

  return value === 'true'
}

const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
const frontendUrls = Array.from(new Set([frontendUrl, ...parseCsv(process.env.FRONTEND_URLS)]))

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  frontendUrl,
  frontendUrls,
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  cookieName: process.env.COOKIE_NAME ?? 'puentes_token',
  cookieSecure: toBoolean(process.env.COOKIE_SECURE, false),
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  resendFrom: process.env.RESEND_FROM ?? 'Puentes <onboarding@resend.dev>',
  contactReceiver: process.env.CONTACT_RECEIVER ?? 'contacto@puentes.local',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
}

env.isProduction = env.nodeEnv === 'production'

import { loadEnv } from './loadEnv.js'

loadEnv()

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
const DEFAULT_DEVELOPMENT_JWT_SECRET = 'change-me-with-a-long-random-secret'
const insecureJwtSecrets = new Set(['change-me', DEFAULT_DEVELOPMENT_JWT_SECRET])

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  frontendUrl,
  frontendUrls,
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET?.trim() || DEFAULT_DEVELOPMENT_JWT_SECRET,
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
env.isTest = env.nodeEnv === 'test'

const configErrors = []

if (!env.databaseUrl) {
  configErrors.push('DATABASE_URL es obligatoria para iniciar el backend.')
}

if (!Number.isFinite(env.port) || env.port <= 0) {
  configErrors.push('PORT debe ser un numero positivo.')
}

if (!env.isTest && insecureJwtSecrets.has(env.jwtSecret)) {
  configErrors.push(
    'JWT_SECRET debe tener un valor real y no puede quedar con el placeholder por defecto en runtime.',
  )
}

if (configErrors.length) {
  throw new Error(
    ['Configuracion invalida de entorno:', ...configErrors.map((message) => `- ${message}`)].join('\n'),
  )
}

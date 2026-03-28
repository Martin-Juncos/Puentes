import { env } from '../../config/env.js'

export const getCloudinaryConfig = () => ({
  cloudName: env.cloudinaryCloudName,
  apiKey: env.cloudinaryApiKey,
  apiSecret: env.cloudinaryApiSecret,
  configured:
    Boolean(env.cloudinaryCloudName) &&
    Boolean(env.cloudinaryApiKey) &&
    Boolean(env.cloudinaryApiSecret),
})

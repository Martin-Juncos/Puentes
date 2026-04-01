import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'

export const app = express()

const allowedOrigins = new Set(env.frontendUrls)
const localHostnames = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])
const privateIpv4Pattern =
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})$/

const isAllowedDevelopmentOrigin = (origin) => {
  if (env.isProduction) {
    return false
  }

  try {
    const url = new URL(origin)

    if (url.protocol !== 'http:') {
      return false
    }

    return (
      localHostnames.has(url.hostname) ||
      privateIpv4Pattern.test(url.hostname) ||
      url.hostname.endsWith('.local') ||
      !url.hostname.includes('.')
    )
  } catch {
    return false
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (allowedOrigins.has(origin) || isAllowedDevelopmentOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`Origen no permitido por CORS: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)

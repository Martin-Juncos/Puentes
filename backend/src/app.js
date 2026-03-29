import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'

export const app = express()

const allowedOrigins = new Set([env.frontendUrl])
const localhostPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (allowedOrigins.has(origin) || (!env.isProduction && localhostPattern.test(origin))) {
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

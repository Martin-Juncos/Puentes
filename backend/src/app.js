import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFoundHandler } from './middleware/notFound.js'

export const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)

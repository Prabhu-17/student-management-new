import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { errorHandler, notFound } from './middlewares/error.js'
import authRoutes from './routes/auth.routes.js'
import studentRoutes from './routes/student.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import logsRoutes from './routes/logs.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: "*", credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads')) // serve uploaded images

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/logs', logsRoutes)

app.use(notFound)
app.use(errorHandler)

export default app

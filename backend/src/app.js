import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import postsRouter from './routes/posts.js'
import adminPostsRouter from './routes/admin.js'
import commentsRouter from './routes/comments.js'
import likesRouter from './routes/likes.js'
import profilesRouter from './routes/profiles.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { getEnv } from './config/env.js'
import { createRateLimiter } from './middlewares/rateLimit.js'
import { sanitizeInput } from './middlewares/sanitizeInput.js'
import { securityHeaders } from './middlewares/securityHeaders.js'

const env = getEnv()
const app = express()

if (env.trustProxy) {
  app.set('trust proxy', 1)
}

const globalRateLimiter = createRateLimiter({
  keyPrefix: 'api',
  windowMs: env.apiRateLimitWindowMs,
  max: env.apiRateLimitMax,
  message: 'Too many requests. Please try again later.',
})

app.use(securityHeaders)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(sanitizeInput)
app.use(globalRateLimiter)

const allowedOrigins = process.env.CORS_ORIGINS.split(',')

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'OK',
    data: { status: 'healthy' },
  })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/admin/posts', adminPostsRouter)
app.use('/api', commentsRouter)
app.use('/api', likesRouter)
app.use('/api', profilesRouter)

// Backward compatible alias while frontend migrates from /api/admin/post.
app.use('/api/admin/post', adminPostsRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  })
})

app.use(errorHandler)

export default app

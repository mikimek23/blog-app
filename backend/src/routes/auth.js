import express from 'express'
import {
  getUserByIdController,
  logoutController,
  meController,
  refreshTokenController,
  userLoginController,
  userRegisterController,
} from '../controllers/users.js'
import { authMiddleware } from '../middlewares/authmiddleware.js'
import { createRateLimiter } from '../middlewares/rateLimit.js'
import { getEnv } from '../config/env.js'

const env = getEnv()
const authRouter = express.Router()

const authRateLimiter = createRateLimiter({
  keyPrefix: 'auth',
  windowMs: env.authRateLimitWindowMs,
  max: env.authRateLimitMax,
  message: 'Too many auth requests. Please try again later.',
})

authRouter.post('/register', authRateLimiter, userRegisterController)
authRouter.post('/login', authRateLimiter, userLoginController)
authRouter.post('/refresh', authRateLimiter, refreshTokenController)
authRouter.post('/refresh-token', authRateLimiter, refreshTokenController)
authRouter.post('/logout', logoutController)
authRouter.get('/me', authMiddleware, meController)

// Temporary compatibility path while frontend migrates from /api/users.
authRouter.get('/:id', authMiddleware, getUserByIdController)

export default authRouter

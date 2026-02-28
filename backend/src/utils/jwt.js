import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { getEnv } from '../config/env.js'

export const generateAccessToken = (user) => {
  const env = getEnv()
  return jwt.sign(
    { sub: String(user._id), role: user.role, type: 'access' },
    env.accessTokenSecret,
    { expiresIn: '15m' },
  )
}

export const generateRefreshToken = (user) => {
  const env = getEnv()
  return jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      type: 'refresh',
      jti: randomUUID(),
    },
    env.refreshTokenSecret,
    { expiresIn: '7d' },
  )
}

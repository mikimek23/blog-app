import { expressjwt } from 'express-jwt'
import { getEnv } from '../config/env.js'
import { createHttpError } from '../utils/response.js'

export const authMiddleware = expressjwt({
  secret: () => getEnv().accessTokenSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
})

export const optionalAuthMiddleware = expressjwt({
  secret: () => getEnv().accessTokenSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  credentialsRequired: false,
})

export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(createHttpError(403, 'Forbidden'))
    }
    return next()
  }

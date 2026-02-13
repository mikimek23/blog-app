import { expressjwt } from 'express-jwt'

export const authMiddleware = expressjwt({
  secret: () => process.env.ACCESS_TOKEN_SECRET,
  algorithms: ['HS256'],
})

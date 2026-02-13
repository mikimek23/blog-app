import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' },
  )
}

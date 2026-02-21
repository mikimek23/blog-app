import bcrypt from 'bcrypt'
import { User } from '../models/users.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'
import jwt from 'jsonwebtoken'
//register user

export const userRegister = async ({ username, email, password }) => {
  const findUser = await User.findOne({ email })
  if (findUser) {
    const error = new Error('user alreay exist')
    error.status = 400
    throw error
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, email, password: hashedPassword })
  return await newUser.save()
}

//login
export const userLogin = async ({ email, password }) => {
  const findUser = await User.findOne({ email })
  if (!findUser) {
    const error = new Error('Incorrect Email or Password!')
    error.status = 400
    throw error
  }
  const isMatch = await bcrypt.compare(password, findUser.password)
  if (!isMatch) {
    const error = new Error('Incorrect Email or password!')
    error.status = 400
    throw error
  }
  const accessToken = generateAccessToken(findUser)

  const refreshToken = generateRefreshToken(findUser)
  findUser.refreshToken = refreshToken
  await findUser.save()

  const res = {
    accessToken,
    refreshToken,
    user: {
      id: findUser._id,
      username: findUser.username,
      email: findUser.email,
      role: findUser.role,
    },
  }
  return res
}
// refresh token session
export const refreshUserSession = async (refreshToken) => {
  let payload
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  } catch {
    const error = new Error('Invalid refresh token')
    error.status = 403
    throw error
  }
  if (payload.type && payload.type !== 'refresh') {
    const error = new Error('Invalid token type')
    error.status = 403
    throw error
  }
  const user = await User.findById(payload.sub)
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('Invalid refresh token')
    error.status = 403
    throw error
  }
  const newAccessToken = generateAccessToken(user)
  const newRefreshToken = generateRefreshToken(user)
  user.refreshToken = newRefreshToken
  await user.save()
  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}
//log out
export const logOutUser = async (refreshToken) => {
  if (!refreshToken) return
  const user = await User.findOne({ refreshToken })
  if (!user) return
  user.refreshToken = undefined
  await user.save()
}
//get user by id
export const getuserById = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
  }
}

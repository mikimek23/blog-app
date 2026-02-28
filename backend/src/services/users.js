import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { User } from '../models/users.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js'
import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'
import { createHttpError } from '../utils/response.js'

export const userRegister = async ({ username, email, password }) => {
  const findUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
  })
  if (findUser) {
    throw createHttpError(400, 'User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({
    username: username.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
  })
  return await newUser.save()
}

const hashRefreshToken = (refreshToken) => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex')
}

const verifyRefreshToken = (refreshToken) => {
  const env = getEnv()
  return jwt.verify(refreshToken, env.refreshTokenSecret)
}

const toUserPayload = (user) => ({
  id: String(user._id),
  username: user.username,
  email: user.email,
  role: user.role,
  bio: user.bio || '',
  avatarUrl: user.avatarUrl || '',
  isActive: user.isActive,
})

export const userLogin = async ({ email, password }) => {
  const findUser = await User.findOne({ email: email.toLowerCase() })
  if (!findUser) {
    throw createHttpError(400, 'Incorrect email or password')
  }
  if (!findUser.isActive) {
    throw createHttpError(403, 'Account is inactive')
  }

  const isMatch = await bcrypt.compare(password, findUser.password)
  if (!isMatch) {
    throw createHttpError(400, 'Incorrect email or password')
  }

  const accessToken = generateAccessToken(findUser)
  const refreshToken = generateRefreshToken(findUser)
  const payload = verifyRefreshToken(refreshToken)
  findUser.refreshTokenHash = hashRefreshToken(refreshToken)
  findUser.refreshTokenExpiresAt = new Date(payload.exp * 1000)
  await findUser.save()

  return {
    accessToken,
    refreshToken,
    user: toUserPayload(findUser),
  }
}

export const refreshUserSession = async (refreshToken) => {
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw createHttpError(403, 'Invalid refresh token')
  }

  if (payload.type && payload.type !== 'refresh') {
    throw createHttpError(403, 'Invalid token type')
  }

  const user = await User.findById(payload.sub)
  if (!user || !user.refreshTokenHash) {
    throw createHttpError(403, 'Invalid refresh token')
  }

  if (
    user.refreshTokenExpiresAt &&
    user.refreshTokenExpiresAt.getTime() < Date.now()
  ) {
    user.refreshTokenHash = null
    user.refreshTokenExpiresAt = null
    await user.save()
    throw createHttpError(403, 'Refresh token expired')
  }

  const currentHash = hashRefreshToken(refreshToken)
  if (currentHash !== user.refreshTokenHash) {
    throw createHttpError(403, 'Invalid refresh token')
  }

  const newAccessToken = generateAccessToken(user)
  const newRefreshToken = generateRefreshToken(user)
  const newPayload = verifyRefreshToken(newRefreshToken)
  user.refreshTokenHash = hashRefreshToken(newRefreshToken)
  user.refreshTokenExpiresAt = new Date(newPayload.exp * 1000)
  await user.save()

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: toUserPayload(user),
  }
}

export const logOutUser = async (refreshToken) => {
  if (!refreshToken) return

  try {
    const payload = verifyRefreshToken(refreshToken)
    const user = await User.findById(payload.sub)
    if (!user) return

    const currentHash = hashRefreshToken(refreshToken)
    if (user.refreshTokenHash !== currentHash) return

    user.refreshTokenHash = null
    user.refreshTokenExpiresAt = null
    await user.save()
  } catch {
    return
  }
}

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw createHttpError(404, 'User not found')
  }
  return toUserPayload(user)
}

export const getUserByAuth = async (auth) => {
  if (!auth?.sub) throw createHttpError(401, 'Unauthorized')
  const user = await User.findById(auth.sub)
  if (!user) throw createHttpError(404, 'User not found')
  return toUserPayload(user)
}

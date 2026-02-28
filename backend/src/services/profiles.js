import mongoose from 'mongoose'
import { User } from '../models/users.js'
import { Post } from '../models/posts.js'
import { createHttpError } from '../utils/response.js'

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tokenizeSearch = (value) =>
  String(value)
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)

const toPublicProfile = (user) => ({
  id: String(user._id),
  username: user.username,
  email: user.email,
  bio: user.bio || '',
  avatarUrl: user.avatarUrl || '',
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
})

export const getPublicProfileByUsername = async ({
  username,
  limit = 10,
  cursor,
}) => {
  const user = await User.findOne({ username, isActive: true })
  if (!user) throw createHttpError(404, 'User profile not found')

  const query = { author: user._id }
  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      throw createHttpError(400, 'Invalid cursor')
    }
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
  }

  const safeLimit = Math.min(Number(limit) || 10, 50)
  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(safeLimit + 1)
  const hasNextPage = posts.length > safeLimit
  const items = hasNextPage ? posts.slice(0, safeLimit) : posts
  const nextCursor = hasNextPage ? String(items[items.length - 1]._id) : null

  return {
    profile: toPublicProfile(user),
    posts: items,
    meta: {
      nextCursor,
      hasNextPage,
      limit: safeLimit,
    },
  }
}

export const updateMyProfile = async ({ userId, payload }) => {
  const user = await User.findById(userId)
  if (!user) throw createHttpError(404, 'User not found')

  if (Object.prototype.hasOwnProperty.call(payload, 'bio')) {
    user.bio = payload.bio || ''
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'avatarUrl')) {
    user.avatarUrl = payload.avatarUrl || ''
  }

  await user.save()
  return toPublicProfile(user)
}

export const getMyProfile = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw createHttpError(404, 'User not found')
  return toPublicProfile(user)
}

export const listUsersForAdmin = async ({ search, limit = 20, cursor }) => {
  const query = {}
  if (search) {
    const tokens = tokenizeSearch(search)
    if (tokens.length) {
      query.$and = tokens.map((token) => {
        const safeToken = escapeRegex(token)
        return {
          $or: [
            { username: { $regex: safeToken, $options: 'i' } },
            { email: { $regex: safeToken, $options: 'i' } },
          ],
        }
      })
    }
  }
  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      throw createHttpError(400, 'Invalid cursor')
    }
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
  }

  const safeLimit = Math.min(Number(limit) || 20, 50)
  const users = await User.find(query)
    .select('username email role isActive createdAt bio avatarUrl')
    .sort({ _id: -1 })
    .limit(safeLimit + 1)

  const hasNextPage = users.length > safeLimit
  const items = hasNextPage ? users.slice(0, safeLimit) : users
  const nextCursor = hasNextPage ? String(items[items.length - 1]._id) : null

  return {
    users: items,
    meta: {
      nextCursor,
      hasNextPage,
      limit: safeLimit,
    },
  }
}

export const updateUserRole = async ({ userId, role }) => {
  const user = await User.findById(userId)
  if (!user) throw createHttpError(404, 'User not found')
  user.role = role
  await user.save()
  return toPublicProfile(user)
}

export const updateUserStatus = async ({ userId, isActive }) => {
  const user = await User.findById(userId)
  if (!user) throw createHttpError(404, 'User not found')
  user.isActive = isActive
  await user.save()
  return toPublicProfile(user)
}

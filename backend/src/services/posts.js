import { Post } from '../models/posts.js'
import { User } from '../models/users.js'
import { createHttpError } from '../utils/response.js'
import mongoose from 'mongoose'
import { attachLikeStats } from './likes.js'

const SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'title'])

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tokenizeSearch = (value) =>
  String(value)
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)

const normalizeSort = ({ sortBy, sortOrder }) => {
  const field = SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt'
  const direction = sortOrder === 'asc' ? 1 : -1
  return { [field]: direction }
}

const buildFilters = async ({ author, tag, search }) => {
  const query = {}

  if (author) {
    const authorDoc = await User.findOne({ username: author }).select('_id')
    if (!authorDoc) {
      return { query, noResults: true }
    }
    query.author = authorDoc._id
  }

  if (tag) {
    query.tags = tag
  }

  if (search) {
    const tokens = tokenizeSearch(search)
    if (tokens.length) {
      query.$and = tokens.map((token) => {
        const safeToken = escapeRegex(token)
        return {
          $or: [
            { title: { $regex: safeToken, $options: 'i' } },
            { content: { $regex: safeToken, $options: 'i' } },
            { tags: { $regex: safeToken, $options: 'i' } },
            { slug: { $regex: safeToken, $options: 'i' } },
          ],
        }
      })
    }
  }

  return { query, noResults: false }
}

const withAuthor = (query) => {
  return query.populate('author', 'username email')
}

export const createPost = async (
  userId,
  { title, content, tags, slug, imageUrl, imagePublicId },
) => {
  const newPost = new Post({
    title,
    content,
    author: userId,
    tags,
    slug,
    imageUrl: imageUrl || null,
    imagePublicId: imagePublicId || null,
  })
  return await newPost.save()
}

const toObjectId = (value) => {
  if (!value) return null
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw createHttpError(400, 'Invalid cursor')
  }
  return new mongoose.Types.ObjectId(value)
}

export const listPosts = async (options = {}, userId = null) => {
  const {
    page = 1,
    limit = 10,
    author,
    tag,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    cursor,
  } = options
  const { query, noResults } = await buildFilters({ author, tag, search })
  const safeLimit = Math.min(Number(limit) || 10, 50)
  const safePage = Math.max(Number(page) || 1, 1)
  const cursorId = toObjectId(cursor)

  if (noResults) {
    return {
      items: [],
      meta: {
        total: 0,
        page: safePage,
        limit: safeLimit,
        totalPages: 0,
      },
    }
  }

  const findQuery = { ...query }
  if (cursorId) {
    findQuery._id = { ...(findQuery._id || {}), $lt: cursorId }
  }

  const total = await Post.countDocuments(query)
  const totalPages = Math.ceil(total / safeLimit) || 1
  const skip = cursorId ? 0 : (safePage - 1) * safeLimit

  const baseQuery = withAuthor(Post.find(findQuery))
  baseQuery.sort(normalizeSort({ sortBy, sortOrder }))

  const rawItems = await baseQuery.skip(skip).limit(safeLimit + 1)
  const hasNextPage = rawItems.length > safeLimit
  const trimmed = hasNextPage ? rawItems.slice(0, safeLimit) : rawItems
  const items = await attachLikeStats(trimmed, userId)
  const nextCursor = hasNextPage
    ? String(trimmed[trimmed.length - 1]._id)
    : null

  return {
    items,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      nextCursor,
      hasNextPage,
    },
  }
}

export const getPostById = async (postId, userId = null) => {
  const post = await withAuthor(Post.findById(postId))
  if (!post) return null
  const [withLikes] = await attachLikeStats([post], userId)
  return withLikes
}

export const getPostBySlug = async (slug, userId = null) => {
  const post = await withAuthor(Post.findOne({ slug }))
  if (!post) return null
  const [withLikes] = await attachLikeStats([post], userId)
  return withLikes
}

const canMutatePost = (post, actor) => {
  if (actor.role === 'admin') return true
  return post.author.equals(actor.sub)
}

export const updatePost = async (actor, postId, changes) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw createHttpError(404, 'Post not found')
  }

  if (!canMutatePost(post, actor)) {
    throw createHttpError(403, 'Forbidden')
  }

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $set: changes },
    { returnDocument: 'after' },
  )
  return updated
}

export const deletePost = async (actor, postId) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw createHttpError(404, 'Post not found')
  }

  if (!canMutatePost(post, actor)) {
    throw createHttpError(403, 'Forbidden')
  }

  await Post.deleteOne({ _id: postId })
  return post
}

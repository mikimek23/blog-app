import { Post } from '../models/posts.js'
import { User } from '../models/users.js'
import { createHttpError } from '../utils/response.js'
import mongoose from 'mongoose'
import { attachLikeStats } from './likes.js'
import { markdownToExcerpt, renderMarkdownToHtml } from '../utils/markdown.js'

const SORT_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'publishedAt',
  'scheduledFor',
  'title',
])

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

const toPlainPost = (post) => (post?.toObject ? post.toObject() : post)

const enrichPost = (post) => {
  if (!post) return post
  const plainPost = toPlainPost(post)
  return {
    ...plainPost,
    contentHtml: renderMarkdownToHtml(plainPost.content),
    excerpt: markdownToExcerpt(plainPost.content),
  }
}

const enrichPosts = (posts) => posts.map(enrichPost)

const toDateOrNull = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw createHttpError(400, 'Invalid scheduled publish datetime')
  }
  return date
}

const ensurePublishableContent = (status, content) => {
  if (status === 'draft') return
  if (!String(content || '').trim()) {
    throw createHttpError(400, 'content is required')
  }
}

const normalizePublishingFields = (changes, existingPost = null) => {
  const targetStatus = changes.status || existingPost?.status || 'published'
  const normalized = { ...changes, status: targetStatus }
  const now = new Date()

  if (Object.prototype.hasOwnProperty.call(normalized, 'scheduledFor')) {
    normalized.scheduledFor = toDateOrNull(normalized.scheduledFor)
  }

  if (targetStatus === 'draft') {
    normalized.scheduledFor = null
    normalized.publishedAt = null
    return normalized
  }

  if (targetStatus === 'scheduled') {
    const scheduledDate =
      normalized.scheduledFor ?? toDateOrNull(existingPost?.scheduledFor)

    if (!scheduledDate) {
      throw createHttpError(400, 'scheduledFor is required for scheduled posts')
    }

    if (scheduledDate <= now) {
      throw createHttpError(400, 'scheduledFor must be a future datetime')
    }

    normalized.scheduledFor = scheduledDate
    normalized.publishedAt = null
    return normalized
  }

  normalized.scheduledFor = null
  if (!existingPost || existingPost.status !== 'published') {
    normalized.publishedAt = now
  } else if (!existingPost.publishedAt) {
    normalized.publishedAt = existingPost.updatedAt || now
  }
  return normalized
}

export const createPost = async (
  userId,
  {
    title,
    content = '',
    tags,
    slug,
    imageUrl,
    imagePublicId,
    status,
    scheduledFor,
  },
) => {
  const publishingFields = normalizePublishingFields({
    status,
    scheduledFor,
  })
  ensurePublishableContent(publishingFields.status, content)

  const newPost = new Post({
    title,
    content,
    author: userId,
    tags,
    slug,
    imageUrl: imageUrl || null,
    imagePublicId: imagePublicId || null,
    ...publishingFields,
  })
  return enrichPost(await newPost.save())
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
    sortBy = 'publishedAt',
    sortOrder = 'desc',
    cursor,
  } = options
  const { query, noResults } = await buildFilters({ author, tag, search })
  query.status = 'published'
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
  const itemsWithLikes = await attachLikeStats(trimmed, userId)
  const items = enrichPosts(itemsWithLikes)
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
  const post = await withAuthor(
    Post.findOne({ _id: postId, status: 'published' }),
  )
  if (!post) return null
  const [withLikes] = await attachLikeStats([post], userId)
  return enrichPost(withLikes)
}

export const getPostBySlug = async (slug, userId = null) => {
  const post = await withAuthor(Post.findOne({ slug, status: 'published' }))
  if (!post) return null
  const [withLikes] = await attachLikeStats([post], userId)
  return enrichPost(withLikes)
}

export const listAdminPosts = async (options = {}, userId = null) => {
  const {
    page = 1,
    limit = 10,
    author,
    tag,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    cursor,
    status = 'all',
  } = options
  const { query, noResults } = await buildFilters({ author, tag, search })
  if (status && status !== 'all') {
    query.status = status
  }

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
  const itemsWithLikes = await attachLikeStats(trimmed, userId)
  const items = enrichPosts(itemsWithLikes)
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

export const getAdminPostById = async (postId, userId = null) => {
  const post = await withAuthor(Post.findById(postId))
  if (!post) return null
  const [withLikes] = await attachLikeStats([post], userId)
  return enrichPost(withLikes)
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

  const publishingFields = normalizePublishingFields(changes, post)
  const nextContent = Object.prototype.hasOwnProperty.call(changes, 'content')
    ? changes.content
    : post.content
  ensurePublishableContent(publishingFields.status, nextContent)

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $set: publishingFields },
    { returnDocument: 'after' },
  )
  return enrichPost(updated)
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

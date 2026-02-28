import mongoose from 'mongoose'
import { Comment } from '../models/comments.js'
import { Post } from '../models/posts.js'
import { createHttpError } from '../utils/response.js'

export const listApprovedCommentsByPost = async (
  postId,
  { limit = 30 } = {},
) => {
  const exists = await Post.exists({ _id: postId })
  if (!exists) throw createHttpError(404, 'Post not found')

  return Comment.find({
    post: postId,
    moderationStatus: 'approved',
  })
    .populate('author', 'username avatarUrl')
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 30, 100))
}

export const createComment = async ({
  postId,
  authorId,
  content,
  authorRole,
}) => {
  const exists = await Post.exists({ _id: postId })
  if (!exists) throw createHttpError(404, 'Post not found')

  const moderationStatus = authorRole === 'admin' ? 'approved' : 'pending'
  const comment = new Comment({
    post: postId,
    author: authorId,
    content,
    moderationStatus,
  })

  return comment.save()
}

export const deleteComment = async ({ commentId, actor }) => {
  const comment = await Comment.findById(commentId)
  if (!comment) throw createHttpError(404, 'Comment not found')

  const isOwner = comment.author.equals(actor.sub)
  const isAdmin = actor.role === 'admin'
  if (!isOwner && !isAdmin) throw createHttpError(403, 'Forbidden')

  await Comment.deleteOne({ _id: commentId })
  return comment
}

export const flagComment = async ({ commentId, reason }) => {
  const comment = await Comment.findById(commentId)
  if (!comment) throw createHttpError(404, 'Comment not found')

  comment.isFlagged = true
  comment.flaggedReason = reason || 'Flagged by user'
  comment.moderationStatus = 'pending'
  await comment.save()
  return comment
}

export const listModerationQueue = async ({
  status = 'pending',
  flaggedOnly = false,
  limit = 20,
  cursor,
}) => {
  const query = {}
  if (status && status !== 'all') query.moderationStatus = status
  if (flaggedOnly) query.isFlagged = true
  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      throw createHttpError(400, 'Invalid cursor')
    }
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) }
  }

  const items = await Comment.find(query)
    .populate('author', 'username email')
    .populate('post', 'title slug')
    .sort({ _id: -1 })
    .limit(Math.min(Number(limit) || 20, 50) + 1)

  const safeLimit = Math.min(Number(limit) || 20, 50)
  const hasNextPage = items.length > safeLimit
  const pageItems = hasNextPage ? items.slice(0, safeLimit) : items
  const nextCursor = hasNextPage
    ? String(pageItems[pageItems.length - 1]._id)
    : null

  return {
    items: pageItems,
    meta: {
      nextCursor,
      hasNextPage,
      limit: safeLimit,
    },
  }
}

export const updateCommentModeration = async ({ commentId, status }) => {
  const comment = await Comment.findById(commentId)
  if (!comment) throw createHttpError(404, 'Comment not found')

  comment.moderationStatus = status
  if (status === 'approved' || status === 'rejected') {
    comment.isFlagged = false
    comment.flaggedReason = ''
  }
  await comment.save()
  return comment
}

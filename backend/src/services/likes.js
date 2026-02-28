import { Like } from '../models/likes.js'
import { Post } from '../models/posts.js'
import { createHttpError } from '../utils/response.js'

const ensurePostExists = async (postId) => {
  const exists = await Post.exists({ _id: postId })
  if (!exists) throw createHttpError(404, 'Post not found')
}

export const toggleLike = async ({ postId, userId }) => {
  await ensurePostExists(postId)
  const existing = await Like.findOne({ post: postId, user: userId })

  let liked
  if (existing) {
    await Like.deleteOne({ _id: existing._id })
    liked = false
  } else {
    await Like.create({ post: postId, user: userId })
    liked = true
  }

  const totalLikes = await Like.countDocuments({ post: postId })
  return { liked, totalLikes }
}

export const getPostLikeStats = async ({ postId, userId }) => {
  await ensurePostExists(postId)
  const totalLikes = await Like.countDocuments({ post: postId })
  const likedByCurrentUser = userId
    ? Boolean(await Like.exists({ post: postId, user: userId }))
    : false

  return { totalLikes, likedByCurrentUser }
}

export const attachLikeStats = async (posts, userId) => {
  if (!Array.isArray(posts) || posts.length === 0) return posts
  const postIds = posts.map((post) => post._id)
  const likeCounts = await Like.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: '$post', totalLikes: { $sum: 1 } } },
  ])

  const likedPostIds = userId
    ? await Like.find({ post: { $in: postIds }, user: userId }).select(
        'post -_id',
      )
    : []

  const countMap = new Map(
    likeCounts.map((entry) => [String(entry._id), entry.totalLikes]),
  )
  const likedSet = new Set(likedPostIds.map((entry) => String(entry.post)))

  return posts.map((postDoc) => {
    const post = postDoc.toObject ? postDoc.toObject() : postDoc
    return {
      ...post,
      totalLikes: countMap.get(String(post._id)) || 0,
      likedByCurrentUser: likedSet.has(String(post._id)),
    }
  })
}

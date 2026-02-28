import { beforeEach, describe, expect, test } from '@jest/globals'
import bcrypt from 'bcrypt'
import { User } from '../models/users.js'
import { Post } from '../models/posts.js'
import { Like } from '../models/likes.js'
import { Comment } from '../models/comments.js'
import { toggleLike, getPostLikeStats } from '../services/likes.js'
import {
  createComment,
  listModerationQueue,
  updateCommentModeration,
} from '../services/comments.js'

let user
let admin
let post

beforeEach(async () => {
  await Like.deleteMany({})
  await Comment.deleteMany({})
  await User.deleteMany({})
  await Post.deleteMany({})
  const hashed = await bcrypt.hash('secret123', 10)

  user = await User.create({
    username: 'reader',
    email: 'reader@test.com',
    password: hashed,
    role: 'user',
  })
  admin = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: hashed,
    role: 'admin',
  })
  post = await Post.create({
    title: 'Test post',
    content: 'Some content',
    author: admin._id,
    slug: 'test-post',
  })
})

describe('likes and comments services', () => {
  test('like toggle is idempotent', async () => {
    const first = await toggleLike({ postId: post._id, userId: user._id })
    expect(first.liked).toBe(true)
    expect(first.totalLikes).toBe(1)

    const second = await toggleLike({ postId: post._id, userId: user._id })
    expect(second.liked).toBe(false)
    expect(second.totalLikes).toBe(0)

    const stats = await getPostLikeStats({ postId: post._id, userId: user._id })
    expect(stats.totalLikes).toBe(0)
    expect(stats.likedByCurrentUser).toBe(false)
  })

  test('comments enter moderation queue and can be approved', async () => {
    const comment = await createComment({
      postId: post._id,
      authorId: user._id,
      content: 'Needs approval',
      authorRole: 'user',
    })
    expect(comment.moderationStatus).toBe('pending')

    const queue = await listModerationQueue({ status: 'pending' })
    expect(queue.items.length).toBe(1)

    const updated = await updateCommentModeration({
      commentId: comment._id,
      status: 'approved',
    })
    expect(updated.moderationStatus).toBe('approved')
  })
})

import { beforeEach, describe, expect, test } from '@jest/globals'
import bcrypt from 'bcrypt'
import { Post } from '../models/posts.js'
import { User } from '../models/users.js'
import {
  createPost,
  deletePost,
  listPosts,
  updatePost,
} from '../services/posts.js'

let author
let admin

beforeEach(async () => {
  await Post.deleteMany({})
  await User.deleteMany({})

  const hashed = await bcrypt.hash('secret123', 10)
  author = await User.create({
    username: 'author-one',
    email: 'author@test.com',
    password: hashed,
    role: 'user',
  })
  admin = await User.create({
    username: 'admin-one',
    email: 'admin@test.com',
    password: hashed,
    role: 'admin',
  })
})

describe('post services', () => {
  test('creates and lists posts with pagination and meta', async () => {
    await createPost(author._id, {
      title: 'First post',
      content: 'First content',
      tags: ['react'],
      slug: 'first-post',
    })
    await createPost(author._id, {
      title: 'Second post',
      content: 'Second content',
      tags: ['node'],
      slug: 'second-post',
    })

    const result = await listPosts({
      page: 1,
      limit: 1,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })

    expect(result.items).toHaveLength(1)
    expect(result.meta.total).toBe(2)
    expect(result.meta.totalPages).toBe(2)
  })

  test('filters posts by author username and search', async () => {
    await createPost(author._id, {
      title: 'React and Node',
      content: 'A guide for full-stack',
      tags: ['react', 'node'],
      slug: 'react-node',
    })

    const byAuthor = await listPosts({ author: 'author-one' })
    expect(byAuthor.items).toHaveLength(1)

    const bySearch = await listPosts({ search: 'guide' })
    expect(bySearch.items).toHaveLength(1)
  })

  test('allows admin to update and delete another users post', async () => {
    const post = await createPost(author._id, {
      title: 'Original',
      content: 'Original content',
      tags: [],
      slug: 'original',
    })

    const updated = await updatePost(
      { sub: String(admin._id), role: 'admin' },
      post._id,
      { title: 'Updated by admin' },
    )
    expect(updated.title).toBe('Updated by admin')

    const deleted = await deletePost(
      { sub: String(admin._id), role: 'admin' },
      post._id,
    )
    expect(String(deleted._id)).toBe(String(post._id))
  })
})

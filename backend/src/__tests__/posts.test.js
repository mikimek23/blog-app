import { beforeEach, describe, expect, test } from '@jest/globals'
import bcrypt from 'bcrypt'
import { Post } from '../models/posts.js'
import { User } from '../models/users.js'
import {
  createPost,
  deletePost,
  listAdminPosts,
  listPosts,
  updatePost,
} from '../services/posts.js'
import { publishDueScheduledPosts } from '../jobs/publishScheduledPosts.js'

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

  test('hides drafts and scheduled posts from public lists', async () => {
    await createPost(author._id, {
      title: 'Public post',
      content: 'Ready to read',
      tags: [],
      slug: 'public-post',
      status: 'published',
    })
    await createPost(author._id, {
      title: 'Draft post',
      content: '',
      tags: [],
      slug: 'draft-post',
      status: 'draft',
    })
    await createPost(author._id, {
      title: 'Scheduled post',
      content: 'Coming soon',
      tags: [],
      slug: 'scheduled-post',
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 60 * 60 * 1000),
    })

    const publicResult = await listPosts({ limit: 10 })
    expect(publicResult.items.map((post) => post.slug)).toEqual(['public-post'])

    const adminResult = await listAdminPosts({ limit: 10, status: 'all' })
    expect(adminResult.items).toHaveLength(3)
  })

  test('publishes due scheduled posts', async () => {
    const post = await Post.create({
      title: 'Due soon',
      content: 'Ready now',
      tags: [],
      slug: 'due-soon',
      author: author._id,
      status: 'scheduled',
      scheduledFor: new Date(Date.now() - 60 * 1000),
      publishedAt: null,
    })

    const modifiedCount = await publishDueScheduledPosts(new Date())
    const updated = await Post.findById(post._id)

    expect(modifiedCount).toBe(1)
    expect(updated.status).toBe('published')
    expect(updated.scheduledFor).toBeNull()
    expect(updated.publishedAt).toBeInstanceOf(Date)
  })

  test('sorts public posts by publishedAt by default', async () => {
    const older = await createPost(author._id, {
      title: 'Older',
      content: 'Older content',
      tags: [],
      slug: 'older',
      status: 'published',
    })
    const newer = await createPost(author._id, {
      title: 'Newer',
      content: 'Newer content',
      tags: [],
      slug: 'newer',
      status: 'published',
    })

    await Post.updateOne(
      { _id: older._id },
      { $set: { publishedAt: new Date('2024-01-01T00:00:00.000Z') } },
    )
    await Post.updateOne(
      { _id: newer._id },
      { $set: { publishedAt: new Date('2024-02-01T00:00:00.000Z') } },
    )

    const result = await listPosts({ limit: 2 })
    expect(result.items.map((post) => post.slug)).toEqual(['newer', 'older'])
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

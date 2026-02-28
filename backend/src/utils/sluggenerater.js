import slugify from 'slugify'
import { Post } from '../models/posts.js'
export const generateSlug = async (title) => {
  if (!title || typeof title !== 'string') throw new Error('Title is required')
  const baseSlug = slugify(title, { lower: true, strict: true })
  let slug = baseSlug
  let counter = 1
  while (await Post.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

import slugify from 'slugify'
import { Post } from '../models/posts.js'
export const generateSlug = async (title) => {
  const beseSlug = slugify(title, { lower: true, strict: true })
  let slug = beseSlug
  let counter = 1
  while (await Post.findOne({ slug })) {
    slug = `${beseSlug}-${counter}`
    counter++
  }
  return slug
}

import { Post } from '../models/posts.js'
import { User } from '../models/users.js'

//create post
export const createPost = async (userId, { title, content, tags, slug }) => {
  const newPost = new Post({ title, content, author: userId, tags, slug })
  return await newPost.save()
}

//list posts
export const listPosts = async (
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) => {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

//list all posts
export const listAllPosts = async (options) => {
  return listPosts({}, options)
}

//list by author
export const listByAuthor = async (author, options) => {
  const user = await User.find({ username: author })
  return await listPosts(user._id, options)
}

// get a post by Id
export const getPostById = async (postId) => {
  return await Post.findById(postId)
}

//update post
export const updatePost = async (
  userId,
  postId,
  { title, content, tags, slug },
) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('psot not found')
    error.status = 404
    throw error
  }
  if (post.author !== userId) {
    const error = new Error('Unauthorized')
    error.status = 403
    throw error
  }
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, content, tags, slug } },
    { new: true },
  )
}

// delete posts
export const deletePost = async (userId, postId) => {
  return await Post.deleteOne({ _id: postId, author: userId })
}

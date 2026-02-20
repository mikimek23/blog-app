import { ConstructionIcon } from 'lucide-react'
import {
  createPost,
  deletePost,
  getPostById,
  listAllPosts,
  listByAuthor,
} from '../services/posts.js'
import { IdValidation, postValidation } from '../utils/inputValidation.js'
import { generateSlug } from '../utils/sluggenerater.js'

// create post
export const createPostController = async (req, res, next) => {
  const { error } = postValidation.validate(req.body)
  if (error) {
    const err = new Error(error.details[0].message)
    err.status = 400
    throw err
  }
  try {
    const slug = generateSlug(req.title)
    const { title, content, tags } = req.body
    const post = { title, content, tags, slug }
    const newpost = await createPost(req.auth.sub, post)
    res
      .status(2001)
      .json({ message: 'post created Successfully!', success: true, newpost })
  } catch (error) {
    next(error)
  }
}

//lest posts
export const listPostController = async (req, res, next) => {
  const { sortBy, sortOrder, author } = req.query
  const options = { sortBy, sortOrder }
  try {
    if (author) {
      const result = await listByAuthor(author, options)
      if (!result) {
        const error = new Error('post not found')
        error.status = 404
        throw error
      }
      return res.status(200).json(result)
    } else {
      const result = await listAllPosts(options)
      if (!result) {
        const error = new Error('post not found')
        error.status = 404
        throw error
      }
      return res.status(200).json(result)
    }
  } catch (error) {
    next(error)
  }
}

// get post by Id
export const getPostByIdController = async (req, res, next) => {
  const { error } = IdValidation.validate(req.params)
  if (error) {
    const err = new Error(error.details[0].message)
    err.status = 400
    throw err
  }
  try {
    const result = await getPostById(req.params)
    if (!result) {
      const error = new Error('post not found')
      error.status = 404
      throw error
    }
    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
//update psot
export const updatePostController = async (req, res, next) => {
  const { error: bodyError } = postValidation.validate(req.body)
  const { error: paramError } = IdValidation.validate(req.params)
  if (bodyError) {
    const err = new Error(bodyError.details[0].message)
    err.status = 400
    throw err
  }

  if (paramError) {
    const err = new Error(paramError.details[0].message)
    err.status = 400
    throw err
  }
  try {
    const slug = generateSlug(req.title)
    const { title, content, tags } = req.body
    const post = { title, content, tags, slug }
    const updatedPost = await createPost(req.auth.sub, req.params, post)
    return res.status(200).json({
      message: 'post updated successfully',
      success: true,
      updatedPost,
    })
  } catch (error) {
    next(error)
  }
}

//Delete post

export const deletePostController = async (req, res, next) => {
  const { error } = IdValidation.validate(req.params)
  if (error) {
    const err = new Error(error.details[0].message)
    err.status = 400
    throw err
  }
  try {
    await deletePost(req.auth.sub, req.params)
    return res.status(200).json({ message: 'psot deleted', success: true })
  } catch (error) {
    next(error)
  }
}

import {
  createPost,
  deletePost,
  getPostById,
  getPostBySlug,
  listPosts,
  updatePost,
} from '../services/posts.js'
import {
  IdValidation,
  postCreateValidation,
  postListQueryValidation,
  postUpdateValidation,
} from '../utils/inputValidation.js'
import { generateSlug } from '../utils/sluggenerater.js'
import { createHttpError, successResponse } from '../utils/response.js'
import {
  deleteImage,
  hasCloudinaryConfig,
  uploadImageBuffer,
} from '../config/cloudinary.js'

const parseTags = (rawTags) => {
  if (!rawTags) return []
  if (Array.isArray(rawTags))
    return rawTags.map((tag) => String(tag).trim()).filter(Boolean)
  if (typeof rawTags === 'string') {
    try {
      const parsed = JSON.parse(rawTags)
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => String(tag).trim()).filter(Boolean)
      }
    } catch {
      return rawTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    }
  }
  return []
}

const uploadPostImage = async (file) => {
  if (!file) return null
  if (!hasCloudinaryConfig()) {
    throw createHttpError(500, 'Cloudinary is not configured')
  }

  const result = await uploadImageBuffer(file.buffer, {
    folder: 'blog/posts',
  })

  return {
    imageUrl: result.secure_url,
    imagePublicId: result.public_id,
  }
}

export const createPostController = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      content: req.body.content,
      tags: parseTags(req.body.tags),
      imageUrl: req.body.imageUrl,
    }

    const { error } = postCreateValidation.validate(payload)
    if (error) throw createHttpError(400, error.details[0].message)

    const image = await uploadPostImage(req.file)
    const slug = await generateSlug(payload.title)
    const newPost = await createPost(req.auth.sub, {
      ...payload,
      slug,
      imageUrl: image?.imageUrl || payload.imageUrl || null,
      imagePublicId: image?.imagePublicId || null,
    })

    return successResponse(res, {
      status: 201,
      message: 'Post created successfully',
      data: newPost,
    })
  } catch (error) {
    next(error)
  }
}

export const listPostController = async (req, res, next) => {
  try {
    const { error, value } = postListQueryValidation.validate(req.query)
    if (error) throw createHttpError(400, error.details[0].message)

    const result = await listPosts(value, req.auth?.sub || null)
    return successResponse(res, {
      message: 'Posts fetched successfully',
      data: result.items,
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}

export const getPostByIdController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate(req.params)
    if (error) throw createHttpError(400, error.details[0].message)

    const post = await getPostById(req.params.id, req.auth?.sub || null)
    if (!post) throw createHttpError(404, 'Post not found')

    return successResponse(res, {
      message: 'Post fetched successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const getPostBySlugController = async (req, res, next) => {
  try {
    const post = await getPostBySlug(req.params.slug, req.auth?.sub || null)
    if (!post) throw createHttpError(404, 'Post not found')

    return successResponse(res, {
      message: 'Post fetched successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const updatePostController = async (req, res, next) => {
  try {
    const { error: paramsError } = IdValidation.validate(req.params)
    if (paramsError) throw createHttpError(400, paramsError.details[0].message)

    const payload = {}
    if (Object.prototype.hasOwnProperty.call(req.body, 'title'))
      payload.title = req.body.title
    if (Object.prototype.hasOwnProperty.call(req.body, 'content'))
      payload.content = req.body.content
    if (Object.prototype.hasOwnProperty.call(req.body, 'tags'))
      payload.tags = parseTags(req.body.tags)
    if (Object.prototype.hasOwnProperty.call(req.body, 'imageUrl'))
      payload.imageUrl = req.body.imageUrl

    const { error } = postUpdateValidation.validate(payload)
    if (error) throw createHttpError(400, error.details[0].message)

    const existing = await getPostById(req.params.id, req.auth?.sub || null)
    if (!existing) throw createHttpError(404, 'Post not found')

    const changes = { ...payload }

    if (payload.title && payload.title !== existing.title) {
      changes.slug = await generateSlug(payload.title)
    }

    if (req.file) {
      const uploaded = await uploadPostImage(req.file)
      changes.imageUrl = uploaded.imageUrl
      changes.imagePublicId = uploaded.imagePublicId
      await deleteImage(existing.imagePublicId)
    }

    const updatedPost = await updatePost(req.auth, req.params.id, changes)
    return successResponse(res, {
      message: 'Post updated successfully',
      data: updatedPost,
    })
  } catch (error) {
    next(error)
  }
}

export const deletePostController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate(req.params)
    if (error) throw createHttpError(400, error.details[0].message)

    const deletedPost = await deletePost(req.auth, req.params.id)
    await deleteImage(deletedPost.imagePublicId)

    return successResponse(res, {
      message: 'Post deleted successfully',
      data: { id: req.params.id },
    })
  } catch (error) {
    next(error)
  }
}

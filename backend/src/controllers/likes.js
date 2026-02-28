import { getPostLikeStats, toggleLike } from '../services/likes.js'
import { IdValidation } from '../utils/inputValidation.js'
import { createHttpError, successResponse } from '../utils/response.js'

export const toggleLikeController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate({ id: req.params.postId })
    if (error) throw createHttpError(400, error.details[0].message)

    const result = await toggleLike({
      postId: req.params.postId,
      userId: req.auth.sub,
    })

    return successResponse(res, {
      message: result.liked ? 'Post liked' : 'Post unliked',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getLikesController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate({ id: req.params.postId })
    if (error) throw createHttpError(400, error.details[0].message)

    const userId = req.auth?.sub || null
    const stats = await getPostLikeStats({ postId: req.params.postId, userId })

    return successResponse(res, {
      message: 'Like stats fetched',
      data: stats,
    })
  } catch (error) {
    next(error)
  }
}

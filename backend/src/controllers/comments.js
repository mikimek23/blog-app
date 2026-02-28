import {
  createComment,
  deleteComment,
  flagComment,
  listApprovedCommentsByPost,
  listModerationQueue,
  updateCommentModeration,
} from '../services/comments.js'
import {
  IdValidation,
  commentCreateValidation,
  commentFlagValidation,
  moderationQueryValidation,
  moderationUpdateValidation,
} from '../utils/inputValidation.js'
import { createHttpError, successResponse } from '../utils/response.js'

export const listPostCommentsController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate({ id: req.params.postId })
    if (error) throw createHttpError(400, error.details[0].message)

    const comments = await listApprovedCommentsByPost(
      req.params.postId,
      req.query,
    )
    return successResponse(res, {
      message: 'Comments fetched successfully',
      data: comments,
    })
  } catch (error) {
    next(error)
  }
}

export const createCommentController = async (req, res, next) => {
  try {
    const { error: idError } = IdValidation.validate({ id: req.params.postId })
    if (idError) throw createHttpError(400, idError.details[0].message)

    const { error } = commentCreateValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const comment = await createComment({
      postId: req.params.postId,
      authorId: req.auth.sub,
      authorRole: req.auth.role,
      content: req.body.content,
    })
    return successResponse(res, {
      status: 201,
      message: 'Comment created successfully',
      data: comment,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCommentController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate(req.params)
    if (error) throw createHttpError(400, error.details[0].message)

    await deleteComment({
      commentId: req.params.id,
      actor: req.auth,
    })
    return successResponse(res, {
      message: 'Comment deleted successfully',
      data: { id: req.params.id },
    })
  } catch (error) {
    next(error)
  }
}

export const flagCommentController = async (req, res, next) => {
  try {
    const { error: idError } = IdValidation.validate(req.params)
    if (idError) throw createHttpError(400, idError.details[0].message)

    const { error } = commentFlagValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const comment = await flagComment({
      commentId: req.params.id,
      reason: req.body.reason,
    })
    return successResponse(res, {
      message: 'Comment flagged for moderation',
      data: comment,
    })
  } catch (error) {
    next(error)
  }
}

export const listModerationCommentsController = async (req, res, next) => {
  try {
    const { error, value } = moderationQueryValidation.validate(req.query)
    if (error) throw createHttpError(400, error.details[0].message)

    const result = await listModerationQueue(value)
    return successResponse(res, {
      message: 'Moderation queue fetched successfully',
      data: result.items,
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}

export const updateModerationCommentController = async (req, res, next) => {
  try {
    const { error: idError } = IdValidation.validate(req.params)
    if (idError) throw createHttpError(400, idError.details[0].message)

    const { error } = moderationUpdateValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const comment = await updateCommentModeration({
      commentId: req.params.id,
      status: req.body.status,
    })
    return successResponse(res, {
      message: 'Comment moderation updated',
      data: comment,
    })
  } catch (error) {
    next(error)
  }
}

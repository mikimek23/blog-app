import express from 'express'
import { authMiddleware, requireRole } from '../middlewares/authmiddleware.js'
import {
  createCommentController,
  deleteCommentController,
  flagCommentController,
  listModerationCommentsController,
  listPostCommentsController,
  updateModerationCommentController,
} from '../controllers/comments.js'

const commentsRouter = express.Router()

commentsRouter.get('/posts/:postId/comments', listPostCommentsController)
commentsRouter.post(
  '/posts/:postId/comments',
  authMiddleware,
  createCommentController,
)
commentsRouter.delete('/comments/:id', authMiddleware, deleteCommentController)
commentsRouter.patch(
  '/comments/:id/flag',
  authMiddleware,
  flagCommentController,
)

commentsRouter.get(
  '/admin/moderation/comments',
  authMiddleware,
  requireRole('admin'),
  listModerationCommentsController,
)
commentsRouter.patch(
  '/admin/moderation/comments/:id/status',
  authMiddleware,
  requireRole('admin'),
  updateModerationCommentController,
)

export default commentsRouter

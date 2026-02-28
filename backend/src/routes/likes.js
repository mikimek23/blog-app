import express from 'express'
import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../middlewares/authmiddleware.js'
import {
  getLikesController,
  toggleLikeController,
} from '../controllers/likes.js'

const likesRouter = express.Router()

likesRouter.get(
  '/posts/:postId/likes',
  optionalAuthMiddleware,
  getLikesController,
)
likesRouter.post(
  '/posts/:postId/likes/toggle',
  authMiddleware,
  toggleLikeController,
)

export default likesRouter

import express from 'express'
import {
  createPostController,
  deletePostController,
  updatePostController,
} from '../controllers/posts.js'
import { authMiddleware, requireRole } from '../middlewares/authmiddleware.js'
import { upload } from '../middlewares/upload.js'

const adminRouter = express.Router()

adminRouter.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  upload.single('image'),
  createPostController,
)
adminRouter.patch(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  upload.single('image'),
  updatePostController,
)
adminRouter.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  deletePostController,
)
export default adminRouter

import express from 'express'
import {
  createPostController,
  deletePostController,
  getAdminPostByIdController,
  listAdminPostController,
  uploadPostImageController,
  updatePostController,
} from '../controllers/posts.js'
import { authMiddleware, requireRole } from '../middlewares/authmiddleware.js'
import { upload } from '../middlewares/upload.js'

const adminRouter = express.Router()

adminRouter.get(
  '/',
  authMiddleware,
  requireRole('admin'),
  listAdminPostController,
)
adminRouter.get(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  getAdminPostByIdController,
)
adminRouter.post(
  '/images',
  authMiddleware,
  requireRole('admin'),
  upload.single('image'),
  uploadPostImageController,
)
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

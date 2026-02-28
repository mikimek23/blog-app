import express from 'express'
import { authMiddleware, requireRole } from '../middlewares/authmiddleware.js'
import {
  adminListUsersController,
  adminUpdateUserRoleController,
  adminUpdateUserStatusController,
  getMyProfileController,
  getPublicProfileController,
  updateMyProfileController,
} from '../controllers/profiles.js'

const profilesRouter = express.Router()

profilesRouter.get('/profiles/me', authMiddleware, getMyProfileController)
profilesRouter.patch('/profiles/me', authMiddleware, updateMyProfileController)
profilesRouter.get('/profiles/:username', getPublicProfileController)

profilesRouter.get(
  '/admin/users',
  authMiddleware,
  requireRole('admin'),
  adminListUsersController,
)
profilesRouter.patch(
  '/admin/users/:id/role',
  authMiddleware,
  requireRole('admin'),
  adminUpdateUserRoleController,
)
profilesRouter.patch(
  '/admin/users/:id/status',
  authMiddleware,
  requireRole('admin'),
  adminUpdateUserStatusController,
)

export default profilesRouter

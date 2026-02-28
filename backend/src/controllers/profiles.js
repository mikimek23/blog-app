import {
  getMyProfile,
  getPublicProfileByUsername,
  listUsersForAdmin,
  updateMyProfile,
  updateUserRole,
  updateUserStatus,
} from '../services/profiles.js'
import {
  profileQueryValidation,
  profileUpdateValidation,
  userRoleUpdateValidation,
  userStatusUpdateValidation,
  usersAdminQueryValidation,
  IdValidation,
} from '../utils/inputValidation.js'
import { createHttpError, successResponse } from '../utils/response.js'

export const getPublicProfileController = async (req, res, next) => {
  try {
    const { error, value } = profileQueryValidation.validate(req.query)
    if (error) throw createHttpError(400, error.details[0].message)

    const result = await getPublicProfileByUsername({
      username: req.params.username,
      ...value,
    })
    return successResponse(res, {
      message: 'Profile fetched successfully',
      data: {
        profile: result.profile,
        posts: result.posts,
      },
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}

export const getMyProfileController = async (req, res, next) => {
  try {
    const profile = await getMyProfile(req.auth.sub)
    return successResponse(res, {
      message: 'My profile fetched successfully',
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const updateMyProfileController = async (req, res, next) => {
  try {
    const { error } = profileUpdateValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const profile = await updateMyProfile({
      userId: req.auth.sub,
      payload: req.body,
    })
    return successResponse(res, {
      message: 'Profile updated successfully',
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const adminListUsersController = async (req, res, next) => {
  try {
    const { error, value } = usersAdminQueryValidation.validate(req.query)
    if (error) throw createHttpError(400, error.details[0].message)

    const result = await listUsersForAdmin(value)
    return successResponse(res, {
      message: 'Users fetched successfully',
      data: result.users,
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}

export const adminUpdateUserRoleController = async (req, res, next) => {
  try {
    const { error: idError } = IdValidation.validate(req.params)
    if (idError) throw createHttpError(400, idError.details[0].message)

    const { error } = userRoleUpdateValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const profile = await updateUserRole({
      userId: req.params.id,
      role: req.body.role,
    })
    return successResponse(res, {
      message: 'User role updated',
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const adminUpdateUserStatusController = async (req, res, next) => {
  try {
    const { error: idError } = IdValidation.validate(req.params)
    if (idError) throw createHttpError(400, idError.details[0].message)

    const { error } = userStatusUpdateValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const profile = await updateUserStatus({
      userId: req.params.id,
      isActive: req.body.isActive,
    })
    return successResponse(res, {
      message: 'User status updated',
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

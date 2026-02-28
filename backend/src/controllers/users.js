import {
  getUserByAuth,
  getUserById,
  logOutUser,
  refreshUserSession,
  userLogin,
  userRegister,
} from '../services/users.js'
import {
  IdValidation,
  userLoginValidation,
  userRegistrationValidation,
} from '../utils/inputValidation.js'
import { createHttpError, successResponse } from '../utils/response.js'
import { getEnv } from '../config/env.js'

const getRefreshTokenCookieOptions = () => {
  const env = getEnv()
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api',
    domain: env.cookieDomain,
  }
}

export const userRegisterController = async (req, res, next) => {
  try {
    const { error } = userRegistrationValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    await userRegister(req.body)
    return successResponse(res, {
      status: 201,
      message: 'Registration completed',
    })
  } catch (error) {
    next(error)
  }
}

export const userLoginController = async (req, res, next) => {
  try {
    const { error } = userLoginValidation.validate(req.body)
    if (error) throw createHttpError(400, error.details[0].message)

    const session = await userLogin(req.body)
    res.cookie(
      'refreshToken',
      session.refreshToken,
      getRefreshTokenCookieOptions(),
    )

    return successResponse(res, {
      message: 'Login successful',
      data: {
        accessToken: session.accessToken,
        user: session.user,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      return successResponse(res, {
        message: 'No active session',
        data: {
          accessToken: null,
          user: null,
        },
      })
    }

    const session = await refreshUserSession(refreshToken)
    res.cookie(
      'refreshToken',
      session.refreshToken,
      getRefreshTokenCookieOptions(),
    )

    return successResponse(res, {
      message: 'Access token refreshed',
      data: {
        accessToken: session.accessToken,
        user: session.user,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    await logOutUser(refreshToken)

    res.clearCookie('refreshToken', getRefreshTokenCookieOptions())
    return successResponse(res, {
      message: 'Logged out',
    })
  } catch (error) {
    next(error)
  }
}

export const getUserByIdController = async (req, res, next) => {
  try {
    const { error } = IdValidation.validate(req.params)
    if (error) throw createHttpError(400, error.details[0].message)

    const user = await getUserById(req.params.id)
    return successResponse(res, {
      message: 'User fetched successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const meController = async (req, res, next) => {
  try {
    const user = await getUserByAuth(req.auth)
    return successResponse(res, {
      message: 'Current user fetched successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

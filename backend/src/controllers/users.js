import { User } from '../models/users.js'
import {
  getuserById,
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
const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/users',
})

// user registration
export const UserRegisterController = async (req, res, next) => {
  const { error } = userRegistrationValidation.validate(req.body)
  if (error) {
    const err = new Error(error.details[0].message)
    err.status = 400
    throw err
  }
  try {
    const user = await userRegister(req.body)
    console.log(user)
    res.status(201).json({
      message: 'Registration completed',
    })
  } catch (error) {
    next(error)
  }
}
//user log in
export const userLoginController = async (req, res, next) => {
  const { error } = userLoginValidation.validate(req.body)
  if (error) {
    const err = new Error(error.details[0].message)
    err.status = 400
    throw err
  }
  try {
    const response = await userLogin(req.body)

    res.cookie(
      'refreshToken',
      response.refreshToken,
      getRefreshTokenCookieOptions(),
    )

    res.status(200).json({
      message: 'you are loged in',
      accessToken: response.accessToken,
      user: response.user,
    })
  } catch (error) {
    next(error)
  }
}

//refresh token
export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'no refresh token', success: false })
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshUserSession(refreshToken)
    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions())
    return res.status(200).json({ accessToken })
  } catch (error) {
    next(error)
  }
}
// log out
export const logOutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    await logOutUser(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api/users',
    })
    return res.status(200).json({ message: 'Logged out' })
  } catch (error) {
    next(error)
  }
}
export const getUserByIdController = async (req, res, next) => {
  const { error } = IdValidation.validate(req.params)
  if (error) {
    const err = new Error(error.details[0].message)
    err.status = 400
    throw err
  }
  try {
    const user = await getuserById(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

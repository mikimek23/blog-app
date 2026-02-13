import { User } from '../models/users.js'
import { getuserById, userLogin, userRegister } from '../services/users.js'
import {
  IdValidation,
  userLoginValidation,
  userRegistrationValidation,
} from '../utils/inputValidation.js'
import { generateAccessToken } from '../utils/jwt.js'
import jwt from 'jsonwebtoken'

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
      success: true,
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

    res.status(200).json({
      message: 'you are loged in',
      success: true,
      response,
    })
  } catch (error) {
    next(error)
  }
}

//refresh token
export const refreshTokenController = async (req, res) => {
  const { token } = req.body
  if (!token)
    return res.status(401).json({ message: 'no token', success: false })
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(payload.sub)
    if (!user || user.refreshToken !== token)
      return res
        .status(403)
        .json({ message: 'Invalid refresh token', success: false })
    const newAccessToken = generateAccessToken(user)
    res.status(200).json({ accesstoken: newAccessToken })
  } catch (error) {
    console.error(error.stack)
    res.status(403).json({ message: 'Invalid token' })
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

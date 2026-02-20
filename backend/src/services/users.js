import bcrypt from 'bcrypt'
import { User } from '../models/users.js'
import { generateAccessToken } from '../utils/jwt.js'
import jwt from 'jsonwebtoken'
//register user

export const userRegister = async ({ username, email, password }) => {
  const findUser = await User.findOne({ email })
  if (findUser) {
    const error = new Error('user alreay exist')
    error.status = 400
    throw error
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, email, password: hashedPassword })
  return await newUser.save()
}

//login
export const userLogin = async ({ email, password }) => {
  const findUser = await User.findOne({ email })
  if (!findUser) {
    const error = new Error('Incorrect Email or Password!')
    error.status = 400
    throw error
  }
  const isMatch = await bcrypt.compare(password, findUser.password)
  if (!isMatch) {
    const error = new Error('Incorrect Email or password!')
    error.status = 400
    throw error
  }
  const accessToken = generateAccessToken(findUser)

  const refreshToken = jwt.sign(
    { sub: findUser._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  )
  findUser.refreshToken = refreshToken
  await findUser.save()
  const res = {
    accessToken,
    refreshToken,
    user: {
      id: findUser._id,
      username: findUser.username,
      email: findUser.email,
      role: findUser.role,
    },
  }
  return res
}

//get user by id
export const getuserById = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
  }
}

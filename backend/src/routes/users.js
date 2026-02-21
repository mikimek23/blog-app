import express from 'express'
import {
  getUserByIdController,
  logOutController,
  refreshTokenController,
  userLoginController,
  UserRegisterController,
} from '../controllers/users.js'

const userRouter = express.Router()

userRouter.post('/register', UserRegisterController)
userRouter.post('/login', userLoginController)
userRouter.post('/refresh-token', refreshTokenController)
userRouter.post('/logout', logOutController)
userRouter.get('/:id', getUserByIdController)
export default userRouter

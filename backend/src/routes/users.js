import express from 'express'
import {
  getUserByIdController,
  refreshTokenController,
  userLoginController,
  UserRegisterController,
} from '../controllers/users.js'

const userRouter = express.Router()

userRouter.post('/register', UserRegisterController)
userRouter.post('/login', userLoginController)
userRouter.post('/refresh-token', refreshTokenController)
userRouter.get('/:id', getUserByIdController)
export default userRouter

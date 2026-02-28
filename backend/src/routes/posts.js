import express from 'express'
import {
  getPostByIdController,
  getPostBySlugController,
  listPostController,
} from '../controllers/posts.js'
import { optionalAuthMiddleware } from '../middlewares/authmiddleware.js'

const postRouter = express.Router()

postRouter.get('/', optionalAuthMiddleware, listPostController)
postRouter.get('/slug/:slug', optionalAuthMiddleware, getPostBySlugController)
postRouter.get('/:id', optionalAuthMiddleware, getPostByIdController)

export default postRouter

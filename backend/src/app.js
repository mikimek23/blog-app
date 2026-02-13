import express from 'express'
import { errorHandler } from './middlewares/errorHandler.js'
import userRouter from './routes/users.js'

const app = express()

app.use(express.json())
//users
app.use('/api/users', userRouter)

app.use((req, res) => {
  res.status(404).json({
    message: 'End point not found!',
    success: false,
  })
})
app.use(errorHandler)
export default app

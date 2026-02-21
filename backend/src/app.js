import express from 'express'
import { errorHandler } from './middlewares/errorHandler.js'
import userRouter from './routes/users.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
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

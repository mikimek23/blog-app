import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'
import { initDatabase } from '../utils/dbinit.js'

beforeAll(async () => {
  await initDatabase()
})

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
})

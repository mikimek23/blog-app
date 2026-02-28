import mongoose from 'mongoose'
import { getEnv } from '../config/env.js'
import { Comment } from '../models/comments.js'

const ensureCommentTtlIndex = async () => {
  const indexes = await Comment.collection.indexes()
  const expiresIndex = indexes.find((index) => index.name === 'expiresAt_1')

  if (!expiresIndex) {
    await Comment.collection.createIndex(
      { expiresAt: 1 },
      { name: 'expiresAt_1', expireAfterSeconds: 0 },
    )
    return
  }

  if (expiresIndex.expireAfterSeconds !== 0) {
    await Comment.collection.dropIndex('expiresAt_1')
    await Comment.collection.createIndex(
      { expiresAt: 1 },
      { name: 'expiresAt_1', expireAfterSeconds: 0 },
    )
  }
}

export const initDatabase = () => {
  const env = getEnv()
  const databaseUrl = env.databaseUrl

  mongoose.connection.on('open', () => {
    console.log('Successfully connected to database')
  })
  return mongoose.connect(databaseUrl).then(async () => {
    await ensureCommentTtlIndex()
  })
}

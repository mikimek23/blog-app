import cron from 'node-cron'
import { Post } from '../models/posts.js'

export const publishDueScheduledPosts = async (now = new Date()) => {
  const result = await Post.updateMany(
    {
      status: 'scheduled',
      scheduledFor: { $lte: now },
    },
    {
      $set: {
        status: 'published',
        publishedAt: now,
        scheduledFor: null,
      },
    },
  )

  return result.modifiedCount || 0
}

export const startScheduledPublisher = () => {
  publishDueScheduledPosts().catch((error) => {
    console.error('Initial scheduled publish job failed:', error)
  })

  return cron.schedule('* * * * *', () => {
    publishDueScheduledPosts().catch((error) => {
      console.error('Scheduled publish job failed:', error)
    })
  })
}

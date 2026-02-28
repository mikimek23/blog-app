import mongoose, { Schema } from 'mongoose'

const likeSchema = new Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true },
)

likeSchema.index({ post: 1, user: 1 }, { unique: true })
likeSchema.index({ post: 1, createdAt: -1 })

export const Like = mongoose.model('like', likeSchema)

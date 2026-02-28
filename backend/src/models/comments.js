import mongoose, { Schema } from 'mongoose'

const COMMENT_TTL_MS = 30 * 1000

const commentSchema = new Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flaggedReason: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

commentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
commentSchema.index({ post: 1, createdAt: -1 })
commentSchema.index({ moderationStatus: 1, isFlagged: 1, createdAt: -1 })

commentSchema.pre('validate', function setCommentExpiry() {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + COMMENT_TTL_MS)
  }
})

export const Comment = mongoose.model('comment', commentSchema)

import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, default: '' },
    author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published'],
      default: 'published',
      index: true,
    },
    scheduledFor: { type: Date, default: null },
    publishedAt: { type: Date, default: Date.now },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    imageUrl: { type: String, default: null },
    imagePublicId: { type: String, default: null },
  },
  {
    timestamps: true,
  },
)

postSchema.index({ createdAt: -1 })
postSchema.index({ status: 1, publishedAt: -1, _id: -1 })
postSchema.index({ status: 1, scheduledFor: 1 })
postSchema.index({ title: 'text', content: 'text' })

export const Post = mongoose.model('post', postSchema)

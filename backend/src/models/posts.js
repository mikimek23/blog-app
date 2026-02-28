import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    tags: [String],
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
postSchema.index({ title: 'text', content: 'text' })

export const Post = mongoose.model('post', postSchema)

import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    tags: [String],
    slung: { type: String, unique: true, lowercase: true },
  },
  {
    timestamps: true,
  },
)
export const Post = mongoose.model('post', postSchema)

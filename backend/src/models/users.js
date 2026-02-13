import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken: { type: String },
  resetpasswordToken: { type: String },
  resetPasswordTokenExpires: { type: Date },
})

export const User = mongoose.model('user', userSchema)

import { v2 as cloudinary } from 'cloudinary'
import { getEnv } from './env.js'

const applyCloudinaryConfig = () => {
  const env = getEnv()
  cloudinary.config({
    cloud_name: env.cloudinaryName,
    api_key: env.cloudinaryKey,
    api_secret: env.cloudinarySecret,
  })
}
applyCloudinaryConfig()

export const hasCloudinaryConfig = () => {
  const env = getEnv()
  return Boolean(
    env.cloudinaryName && env.cloudinaryKey && env.cloudinarySecret,
  )
}

export const uploadImageBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      },
    )
    stream.end(buffer)
  })
}

export const deleteImage = async (publicId) => {
  if (!publicId) return
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary

import { api } from './axios.js'

const unwrap = (response) => response?.data?.data ?? null

export const getLikeStats = async (postId) => {
  const response = await api.get(`/posts/${postId}/likes`)
  return unwrap(response)
}

export const togglePostLike = async (postId) => {
  const response = await api.post(`/posts/${postId}/likes/toggle`)
  return unwrap(response)
}

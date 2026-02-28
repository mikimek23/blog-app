import { api } from './axios.js'

const unwrap = (response) => ({
  data: response?.data?.data ?? null,
  meta: response?.data?.meta ?? null,
  message: response?.data?.message,
})

export const listPosts = async (params = {}) => {
  const response = await api.get('/posts', { params })
  return unwrap(response)
}

export const getPostById = async (postId) => {
  const response = await api.get(`/posts/${postId}`)
  return unwrap(response).data
}

export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts/slug/${slug}`)
  return unwrap(response).data
}

export const createAdminPost = async (formData) => {
  const response = await api.post('/admin/posts', formData)
  return unwrap(response).data
}

export const updateAdminPost = async (postId, formData) => {
  const response = await api.patch(`/admin/posts/${postId}`, formData)
  return unwrap(response).data
}

export const deleteAdminPost = async (postId) => {
  const response = await api.delete(`/admin/posts/${postId}`)
  return unwrap(response).data
}

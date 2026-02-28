import { api } from './axios.js'

const unwrap = (response) => ({
  data: response?.data?.data ?? null,
  meta: response?.data?.meta ?? null,
  message: response?.data?.message,
})

export const listPostComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`)
  return unwrap(response).data || []
}

export const createPostComment = async (postId, payload) => {
  const response = await api.post(`/posts/${postId}/comments`, payload)
  return unwrap(response).data
}

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`)
  return unwrap(response).data
}

export const flagComment = async (commentId, payload) => {
  const response = await api.patch(`/comments/${commentId}/flag`, payload)
  return unwrap(response).data
}

export const listModerationComments = async (params = {}) => {
  const response = await api.get('/admin/moderation/comments', { params })
  return unwrap(response)
}

export const updateModerationComment = async (commentId, status) => {
  const response = await api.patch(
    `/admin/moderation/comments/${commentId}/status`,
    {
      status,
    },
  )
  return unwrap(response).data
}

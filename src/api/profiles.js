import { api } from './axios.js'

const unwrap = (response) => ({
  data: response?.data?.data ?? null,
  meta: response?.data?.meta ?? null,
  message: response?.data?.message,
})

export const getPublicProfile = async (username, params = {}) => {
  const response = await api.get(`/profiles/${username}`, { params })
  return unwrap(response)
}

export const getMyProfile = async () => {
  const response = await api.get('/profiles/me')
  return unwrap(response).data
}

export const updateMyProfile = async (payload) => {
  const response = await api.patch('/profiles/me', payload)
  return unwrap(response).data
}

export const adminListUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params })
  return unwrap(response)
}

export const adminUpdateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role })
  return unwrap(response).data
}

export const adminUpdateUserStatus = async (userId, isActive) => {
  const response = await api.patch(`/admin/users/${userId}/status`, {
    isActive,
  })
  return unwrap(response).data
}

import { clearAccessToken, setAccessToken } from '../hooks/tokenStore.js'
import { api } from './axios'

export const userRegister = async (data) => {
  const res = await api.post('/users/register', data)
  return res
}
export const userLogin = async (data) => {
  const res = await api.post('/users/login', data)
  if (res.data?.accessToken) setAccessToken(res.data.accessToken)
  return res
}
export const refreshAccessToken = async () => {
  const res = await api.post('/users/refresh-token')
  if (res.data?.accessToken) setAccessToken(res.data.accessToken)
}
export const userLogOut = async () => {
  await api.post('/users/logout')
  clearAccessToken()
}

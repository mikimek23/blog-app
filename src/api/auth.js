import { api } from './axios'

export const userRegister = async (data) => {
  const res = await api.post('/users/register', data)
  return res
}
export const userLogin = async (data) => {
  const res = await api.post('/users/login', data)
  return res
}

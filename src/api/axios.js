import axios from 'axios'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../hooks/tokenStore.js'

export const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
})
const refreshClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
})
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
let refreshPromise = null
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/users/login') &&
      !originalRequest.url?.includes('/users/refresh-token')
    ) {
      originalRequest._retry = true
      try {
        if (!refreshPromise)
          refreshPromise = await refreshClient
            .post('/users/refresh-token')
            .then((r) => {
              const token = r.data?.accessToken
              if (!token) throw new Error('No access token from refresh')
            })
            .finally(() => {
              refreshPromise = null
            })
        const newToken = await refreshPromise
        setAccessToken(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshErr) {
        clearAccessToken()
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)
  },
)

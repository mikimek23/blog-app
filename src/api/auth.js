import {
  clearSession,
  setAccessToken,
  setAuthInitialized,
  setCurrentUser,
  setSession,
} from '../hooks/tokenStore.js'
import { api, setApiAuthFailureHandler } from './axios.js'

const unwrap = (response) => response?.data?.data ?? null

export const userRegister = async (payload) => {
  const response = await api.post('/auth/register', payload)
  return unwrap(response)
}

export const userLogin = async (payload) => {
  const response = await api.post('/auth/login', payload)
  const data = unwrap(response)

  setSession({
    accessToken: data?.accessToken,
    user: data?.user,
  })
  return data
}

export const refreshAccessToken = async () => {
  const response = await api.post('/auth/refresh')
  const data = unwrap(response)
  if (data?.accessToken) setAccessToken(data.accessToken)
  if (data?.user) setCurrentUser(data.user)
  return data
}

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me')
  const data = unwrap(response)
  setCurrentUser(data)
  return data
}

export const userLogOut = async () => {
  try {
    await api.post('/auth/logout')
  } finally {
    clearSession()
  }
}

export const bootstrapSession = async () => {
  try {
    const refreshed = await refreshAccessToken()
    if (!refreshed?.accessToken) {
      clearSession()
    } else if (!refreshed?.user) {
      await fetchCurrentUser()
    }
  } catch {
    clearSession()
  } finally {
    setAuthInitialized(true)
  }
}

export const initializeApiAuthHandlers = (onAuthFailure) => {
  setApiAuthFailureHandler(() => {
    clearSession()
    setAuthInitialized(true)
    if (onAuthFailure) onAuthFailure()
  })
}

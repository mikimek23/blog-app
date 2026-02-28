const listeners = new Set()

let authState = {
  accessToken: null,
  user: null,
  initialized: false,
}

const notify = () => {
  listeners.forEach((listener) => listener())
}

const setState = (updater) => {
  const nextState = updater(authState)
  authState = nextState
  notify()
}

export const subscribeAuth = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getAuthState = () => authState

export const setAccessToken = (token) => {
  setState((prev) => ({
    ...prev,
    accessToken: token || null,
  }))
}

export const setCurrentUser = (user) => {
  setState((prev) => ({
    ...prev,
    user: user || null,
  }))
}

export const setSession = ({ accessToken, user }) => {
  setState((prev) => ({
    ...prev,
    accessToken: accessToken || null,
    user: user || null,
  }))
}

export const clearSession = () => {
  setState((prev) => ({
    ...prev,
    accessToken: null,
    user: null,
  }))
}

export const setAuthInitialized = (initialized) => {
  setState((prev) => ({
    ...prev,
    initialized: Boolean(initialized),
  }))
}

export const getAccessToken = () => authState.accessToken
export const getCurrentUser = () => authState.user
export const isInitialized = () => authState.initialized
export const isAuthenticated = () => Boolean(authState.accessToken)

// Backward-compatible aliases used by existing components.
export const subscribeToken = subscribeAuth
export const clearAccessToken = clearSession

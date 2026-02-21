let accessToken = null
const listeners = new Set()
const notify = () => listeners.forEach((l) => l())
export const subscribeToken = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const setAccessToken = (token) => {
  accessToken = token
  notify()
}
export const getAccessToken = () => {
  return accessToken
}
export const clearAccessToken = () => {
  accessToken = null
  notify()
}

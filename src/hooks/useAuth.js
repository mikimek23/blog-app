import { useSyncExternalStore } from 'react'
import {
  getAuthState,
  isAuthenticated,
  isInitialized,
  subscribeAuth,
} from './tokenStore.js'

export const useAuth = () => {
  const state = useSyncExternalStore(subscribeAuth, getAuthState, getAuthState)
  return {
    ...state,
    isAuthenticated: isAuthenticated(),
    isInitialized: isInitialized(),
  }
}

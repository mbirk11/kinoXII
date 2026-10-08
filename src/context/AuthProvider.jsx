import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AuthContext } from './AuthContext'
import { ApiError, getToken, onUnauthorized, setToken } from '../api/client'
import * as authApi from '../api/auth'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getToken()))
  const [authModal, setAuthModal] = useState(null)
  // Action the user tried before logging in; replayed once they are signed in
  const pendingActionRef = useRef(null)

  const openLogin = useCallback(() => setAuthModal('login'), [])
  const openRegister = useCallback(() => setAuthModal('register'), [])

  const closeAuthModal = useCallback(() => {
    pendingActionRef.current = null
    setAuthModal(null)
  }, [])

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Restore the session from a stored token
  useEffect(() => {
    if (!getToken()) return

    authApi
      .getMe()
      .then(setUser)
      .catch(clearSession)
      .finally(() => setIsAuthLoading(false))
  }, [clearSession])

  // A 401 from any protected request means the session expired
  useEffect(() => {
    onUnauthorized(() => {
      clearSession()
      setAuthModal('login')
    })
    return () => onUnauthorized(null)
  }, [clearSession])

  const finishAuth = useCallback(({ user: signedInUser, token }) => {
    setToken(token)
    setUser(signedInUser)
    setAuthModal(null)

    const pendingAction = pendingActionRef.current
    pendingActionRef.current = null
    // The action reports its own errors; just avoid an unhandled rejection
    Promise.resolve(pendingAction?.(signedInUser)).catch(() => {})
  }, [])

  const login = useCallback(
    async (credentials) => finishAuth(await authApi.login(credentials)),
    [finishAuth],
  )

  const register = useCallback(
    async (fields) => finishAuth(await authApi.register(fields)),
    [finishAuth],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      clearSession()
    }
  }, [clearSession])

  // Runs the action for signed-in users, otherwise asks them to log in first
  const requireAuth = useCallback(
    async (action) => {
      if (!user) {
        pendingActionRef.current = action
        setAuthModal('login')
        return
      }

      try {
        await action(user)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          pendingActionRef.current = action
          return
        }
        throw error
      }
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthLoading,
      authModal,
      openLogin,
      openRegister,
      closeAuthModal,
      login,
      register,
      logout,
      requireAuth,
    }),
    [
      user,
      isAuthLoading,
      authModal,
      openLogin,
      openRegister,
      closeAuthModal,
      login,
      register,
      logout,
      requireAuth,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

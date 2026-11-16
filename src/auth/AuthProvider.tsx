import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  apiGet,
  apiLogout,
  restoreAccessToken,
  setAccessToken,
  subscribeSessionExpired,
} from '../api/client'
import type { ApiUser } from '../api/contracts'
import {
  login as loginService,
  register as registerService,
} from '../services/authService'

type RegisterInput = {
  displayName: string
  email: string
  password: string
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
}

type AuthContextValue = {
  user: ApiUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeExpired = subscribeSessionExpired(() => {
      setUser(null)
    })

    void restoreAccessToken()
      .then(() => apiGet<ApiUser>('/me'))
      .then(setUser)
      .catch(() => {
        setAccessToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))

    return () => {
      unsubscribeExpired()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setUser(await loginService(email, password))
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    setUser(await registerService(input))
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    setUser(await apiGet<ApiUser>('/me'))
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshProfile }),
    [user, loading, login, register, logout, refreshProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}


import * as SecureStore from 'expo-secure-store'
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { api } from '@libs/api'

export type AuthContextDataProps = {
  token: string
  signIn: (code: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticating: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [token, setToken] = useState<string>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  async function tokenUpdate(token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    setToken(token)
  }

  async function storageTokenSave(token: string, refreshToken: string) {
    try {
      setIsAuthenticating(true)

      await SecureStore.setItemAsync('token', token)
      await SecureStore.setItemAsync('refreshToken', refreshToken)
    } catch (error) {
      throw new Error(error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function signIn(code: string) {
    try {
      setIsAuthenticating(true)

      const { data } = await api.post('/register', { code })

      if (data.token && data.refreshToken) {
        await storageTokenSave(data.token, data.refreshToken)
        tokenUpdate(data.token)
      }
    } catch (error) {
      throw new Error(error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const signOut = useCallback(async () => {
    try {
      setIsAuthenticating(true)

      setToken(null)
      await SecureStore.deleteItemAsync('token')
      await SecureStore.deleteItemAsync('refreshToken')
    } catch (error) {
      throw new Error(error)
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  async function loadToken() {
    try {
      setIsAuthenticating(true)

      const token = await SecureStore.getItemAsync('token')

      if (token) {
        await tokenUpdate(token)
      }
    } catch (error) {
      throw new Error(error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    loadToken()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider
      value={{
        token,
        signIn,
        signOut,
        isAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

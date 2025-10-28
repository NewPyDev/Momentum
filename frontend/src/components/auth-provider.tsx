"use client"

import { createContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { authApi } from '@/lib/api'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      authApi.getProfile()
        .then(setUser)
        .catch(() => {
          Cookies.remove('token')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    Cookies.set('token', response.access_token, { expires: 7 })
    setUser(response.user)
  }

  const register = async (email: string, password: string, username: string) => {
    const response = await authApi.register(email, password, username)
    Cookies.set('token', response.access_token, { expires: 7 })
    setUser(response.user)
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}


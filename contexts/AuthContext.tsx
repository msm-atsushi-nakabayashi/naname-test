'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import usersData from '@/data/users.json'

interface User {
  id: string
  email: string
  name: string
  role: 'mentee' | 'mentor' | 'admin'
  department?: string
  skills?: string[]
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // 初期化中かどうかを管理

  useEffect(() => {
    // localStorageから既存のログイン情報を取得
    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error)
    } finally {
      setIsLoading(false) // 初期化完了
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // 中林篤史のアカウントでログイン
    if (email === 'atsushi.uxpz.nakabayashi@misumi.co.jp' && password === 'password123') {
      const nakabayashiUser = usersData.users.find(u => u.id === '1')
      if (nakabayashiUser) {
        const userData: User = {
          id: nakabayashiUser.id,
          email: nakabayashiUser.email,
          name: nakabayashiUser.name,
          role: nakabayashiUser.roles.includes('admin') ? 'admin' : 
                nakabayashiUser.roles.includes('mentor') ? 'mentor' : 'mentee',
          department: nakabayashiUser.department,
          avatar: nakabayashiUser.avatarUrl
        }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
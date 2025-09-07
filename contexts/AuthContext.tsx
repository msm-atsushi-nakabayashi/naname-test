'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import usersData from '@/data/users.json'

interface User {
  id: string
  email: string
  name: string
  roles: string[]
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
    // ユーザーデータからメールアドレスで検索
    const foundUser = usersData.users.find(u => u.email === email)
    
    if (foundUser) {
      // パスワードの検証
      let isValidPassword = false
      
      // 中林篤史のアカウント
      if (email === 'atsushi.uxpz.nakabayashi@misumi.co.jp' && password === 'password123') {
        isValidPassword = true
      }
      // 三隅太郎のアカウント
      else if (email === 'taro.misumi@misumi.co.jp' && password === 'guest') {
        isValidPassword = true
      }
      // 管理者アカウント
      else if (email === 'admin@company.com' && password === 'admin123') {
        isValidPassword = true
      }
      // その他のテストアカウント
      else if (password === 'password') {
        isValidPassword = true
      }
      
      if (isValidPassword) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          roles: foundUser.roles,
          department: foundUser.department,
          avatar: foundUser.avatarUrl
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
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'atsushi.nakabayashi@example.com',
    password: 'password123',
    user: {
      id: '1',
      email: 'atsushi.nakabayashi@example.com',
      name: '中林 篤史',
      role: 'mentee',
      department: 'エンジニアリング部',
      skills: ['JavaScript', 'React', 'TypeScript'],
      avatar: '/avatars/nakabayashi.jpg'
    }
  },
  {
    email: 'mentor@example.com',
    password: 'mentor123',
    user: {
      id: '2',
      email: 'mentor@example.com',
      name: '山田 太郎',
      role: 'mentor',
      department: 'エンジニアリング部',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
      avatar: '/avatars/yamada.jpg'
    }
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      setUser(foundUser.user)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(foundUser.user))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
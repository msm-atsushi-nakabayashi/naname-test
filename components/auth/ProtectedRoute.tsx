'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'mentee' | 'mentor' | 'admin'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 初期化が完了してからチェック
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, requiredRole, router, isLoading])

  // 初期化中はローディング表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // リダイレクトを待つ
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">アクセス権限がありません</div>
      </div>
    )
  }

  return <>{children}</>
}
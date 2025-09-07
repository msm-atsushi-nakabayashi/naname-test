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
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login')
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 初期化中はローディング表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  // 認証されていない場合
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">ログインページへリダイレクト中...</div>
      </div>
    )
  }

  // 権限チェック
  if (requiredRole && user && !user.roles?.includes(requiredRole) && !user.roles?.includes('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">アクセス権限がありません</div>
      </div>
    )
  }

  return <>{children}</>
}
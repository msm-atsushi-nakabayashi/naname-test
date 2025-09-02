'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  Award,
  LogOut,
  Bell,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: Home },
  { name: 'メンター', href: '/mentors', icon: Users },
  { name: 'メンタリング', href: '/mentoring', icon: Calendar },
  { name: 'ナレッジ', href: '/knowledge', icon: BookOpen },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-16 bg-white border-b border-gray-200">
      <div className="flex flex-1 items-center px-4">
        <div className="flex items-center">
          <Award className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            メンタリングプラットフォーム
          </span>
        </div>
        
        {isAuthenticated && (
          <nav className="ml-8 flex space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role === 'admin' ? '管理者' :
                     user?.role === 'mentor' ? 'メンター' : 
                     'メンティー'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <LogIn className="mr-2 h-4 w-4" />
              ログイン
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
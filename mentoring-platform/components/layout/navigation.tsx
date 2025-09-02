'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Calendar, 
  BookOpen, 
  Award,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/data/mock';

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: Home },
  { name: 'メンター', href: '/mentors', icon: Users },
  { name: 'メンタリング', href: '/mentoring', icon: Calendar },
  { name: 'ナレッジ', href: '/knowledge', icon: BookOpen },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex h-16 bg-white border-b border-gray-200">
      <div className="flex flex-1 items-center px-4">
        <div className="flex items-center">
          <Award className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            メンタリングプラットフォーム
          </span>
        </div>
        
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

        <div className="ml-auto flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {currentUser.name}
              </span>
              <span className="text-xs text-gray-500">
                {currentUser.roles.map(role => 
                  role === 'admin' ? '管理者' :
                  role === 'mentor' ? 'メンター' : 
                  'メンティー'
                ).join('・')}
              </span>
            </div>
          </div>

          <button className="p-2 text-gray-600 hover:text-gray-900">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
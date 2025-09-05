'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Users, Video, FileText, Star, Plus } from 'lucide-react';
import { mockSessions } from '@/lib/data/mock';
import { formatDateTime, getStatusLabel, getStatusColor, cn } from '@/lib/utils';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function MentoringPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [sessionType, setSessionType] = useState<'all' | 'long-term' | 'flash'>('all');
  const [temporaryBookings, setTemporaryBookings] = useState<{
    id: string;
    mentorName: string;
    date: string;
    time: string;
  }[]>([]);

  // localStorageから一時的な予約を取得
  useEffect(() => {
    const tempBookings = JSON.parse(localStorage.getItem('tempBookings') || '[]');
    setTemporaryBookings(tempBookings);
  }, []);

  const userSessions = mockSessions.filter(
    s => s.menteeId === user?.id || s.mentorId === user?.id
  );

  const filteredSessions = userSessions.filter(session => {
    
    let matchesTab = true;
    if (activeTab === 'upcoming') {
      matchesTab = session.status === 'ongoing' || session.status === 'approved';
    } else if (activeTab === 'past') {
      matchesTab = session.status === 'completed';
    }

    const matchesType = sessionType === 'all' || session.type === sessionType;

    return matchesTab && matchesType;
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">メンタリングセッション</h1>
          <p className="mt-2 text-gray-600">あなたのメンタリングセッションを管理</p>
        </div>
        <Link
          href="/mentors"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          新規メンタリング
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">総セッション数</p>
              <p className="text-xl font-bold text-gray-900">{userSessions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">今月の時間</p>
              <p className="text-xl font-bold text-gray-900">4.5時間</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">メンター数</p>
              <p className="text-xl font-bold text-gray-900">3名</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">平均評価</p>
              <p className="text-xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'upcoming'
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                予定中
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'past'
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                完了済み
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'all'
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                すべて
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as 'all' | 'long-term' | 'flash')}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="all">すべての種類</option>
                <option value="long-term">長期メンタリング</option>
                <option value="flash">フラッシュメンタリング</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="divide-y divide-gray-200">
          {filteredSessions.map(session => (
            <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Image
                    src={session.mentor.user.avatarUrl || '/default-avatar.png'}
                    alt={session.mentor.user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {session.mentor.user.name}
                      </h3>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        session.type === 'long-term'
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      )}>
                        {session.type === 'long-term' ? '長期' : 'フラッシュ'}
                      </span>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        getStatusColor(session.status)
                      )}>
                        {getStatusLabel(session.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {session.scheduledAt && formatDateTime(session.scheduledAt)}
                      </div>
                      {session.duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.duration}分
                        </div>
                      )}
                    </div>
                    {session.notes && session.notes.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        議事録: {session.notes[0].content.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {session.status === 'ongoing' && (
                    <>
                      <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        参加
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        議事録
                      </button>
                    </>
                  )}
                  {session.status === 'completed' && !session.review && (
                    <button className="px-3 py-1 text-sm bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      レビューを書く
                    </button>
                  )}
                  {session.review && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {session.review.rating}/5
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 一時的な予約の表示 */}
        {temporaryBookings.length > 0 && activeTab === 'upcoming' && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <p className="font-bold text-gray-900 mb-2">予約中のセッション（デモ用）</p>
            {temporaryBookings.map((booking, index) => (
              <div key={index} className="mt-2 p-3 bg-white rounded border">
                <p className="font-medium">メンター: {booking.mentorName}</p>
                <p className="text-sm text-gray-600">
                  日時: {new Date(booking.date).toLocaleDateString('ja-JP')} {booking.time}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ※ ブラウザをリロードすると消えます
                </p>
              </div>
            ))}
          </div>
        )}

        {filteredSessions.length === 0 && temporaryBookings.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">該当するセッションがありません</p>
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  );
}
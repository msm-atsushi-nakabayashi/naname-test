'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Users, BookOpen, TrendingUp, Clock, Star, ThumbsUp, Eye } from 'lucide-react';
import { mockSessions, mockMentorProfiles, mockKnowledgeArticles } from '@/lib/data/mock';
import { formatDate, getStatusLabel, getStatusColor, getRankLabel, getRankColor, cn } from '@/lib/utils';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { likesService } from '@/lib/services/likesService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [articleLikes, setArticleLikes] = useState<{ [key: string]: { liked: boolean; count: number } }>({});
  
  const upcomingSessions = mockSessions
    .filter(s => s.menteeId === user?.id && s.status === 'ongoing')
    .slice(0, 3);

  const topMentors = mockMentorProfiles
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const recentArticles = mockKnowledgeArticles
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  useEffect(() => {
    if (user) {
      const likesData: { [key: string]: { liked: boolean; count: number } } = {};
      recentArticles.forEach(article => {
        likesData[article.id] = {
          liked: likesService.isLiked(article.id, user.id),
          count: article.likes + likesService.getLikesCount(article.id)
        };
      });
      setArticleLikes(likesData);
    }
  }, [user]);

  const handleLikeToggle = (articleId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user) return;
    
    const isNowLiked = likesService.toggleLike(articleId, user.id);
    const article = recentArticles.find(a => a.id === articleId);
    if (article) {
      const newCount = article.likes + likesService.getLikesCount(articleId);
      setArticleLikes(prev => ({
        ...prev,
        [articleId]: {
          liked: isNowLiked,
          count: newCount
        }
      }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="mt-2 text-gray-600">ようこそ、{user?.name}さん</p>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">今月のセッション</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">アクティブメンター</p>
              <p className="text-2xl font-bold text-gray-900">{mockMentorProfiles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">ナレッジ記事</p>
              <p className="text-2xl font-bold text-gray-900">{mockKnowledgeArticles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">成長ポイント</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">予定されているセッション</h2>
          </div>
          <div className="p-6">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {session.mentor.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.scheduledAt && formatDate(session.scheduledAt)}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${getStatusColor(session.status)}`}>
                        {getStatusLabel(session.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">予定されているセッションはありません</p>
            )}
            <Link href="/mentoring" className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800">
              すべて見る →
            </Link>
          </div>
        </div>

        {/* Top Mentors */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">トップメンター</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topMentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center space-x-3">
                  <Image
                    src={mentor.user.avatarUrl || '/default-avatar.png'}
                    alt={mentor.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{mentor.user.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs text-gray-600">{mentor.rating}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getRankColor(mentor.rank)}`}>
                        {getRankLabel(mentor.rank)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/mentors" className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800">
              すべて見る →
            </Link>
          </div>
        </div>

        {/* Recent Knowledge */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">最新のナレッジ</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="space-y-2">
                  <Link href={`/knowledge/${article.id}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{article.author.name}</span>
                    <span>•</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.views}
                      </div>
                      <button
                        onClick={(e) => handleLikeToggle(article.id, e)}
                        className={cn(
                          "flex items-center px-2 py-1 rounded text-xs transition-all",
                          articleLikes[article.id]?.liked
                            ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            : "text-gray-500 hover:bg-gray-100"
                        )}
                      >
                        <ThumbsUp className={cn(
                          "h-3 w-3 mr-1",
                          articleLikes[article.id]?.liked && "fill-current"
                        )} />
                        {articleLikes[article.id]?.count || article.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/knowledge" className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-800">
              すべて見る →
            </Link>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  ThumbsUp,
  TrendingUp,
  Activity,
  BarChart3,
  Calendar,
  Eye,
  UserPlus,
  Award,
  Clock,
  MessageCircle,
  Edit3,
  Star,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers, mockKnowledgeArticles, mockSessions, mockMentorProfiles } from '@/lib/data/mock';
import { likesService } from '@/lib/services/likesService';
import { adminReactionService } from '@/lib/services/adminReactionService';
import { formatDate } from '@/lib/utils';
import SessionReactionPanel from '@/components/admin/SessionReactionPanel';
import MentorProfileEditor from '@/components/admin/MentorProfileEditor';
import { mentorProfileService } from '@/lib/services/mentorProfileService';
import { MentoringSession, AdminReaction, MentorProfile } from '@/lib/types';

interface DashboardStats {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  totalArticles: number;
  totalSessions: number;
  completedSessions: number;
  totalLikes: number;
  totalViews: number;
  newUsersThisMonth: number;
  activeSessionsToday: number;
}

interface PopularArticle {
  id: string;
  title: string;
  author: string;
  likes: number;
  views: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    totalArticles: 0,
    totalSessions: 0,
    completedSessions: 0,
    totalLikes: 0,
    totalViews: 0,
    newUsersThisMonth: 0,
    activeSessionsToday: 0
  });
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [recentSessions, setRecentSessions] = useState<{
    id: string;
    mentor: string;
    mentee: string;
    type: string;
    status: string;
    scheduledAt: Date;
  }[]>([]);
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null);
  const [showReactionPanel, setShowReactionPanel] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [showMentorEditor, setShowMentorEditor] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user && !user.roles.includes('admin')) {
      router.push('/dashboard');
      return;
    }

    // Calculate statistics
    const mentors = mockUsers.filter(u => u.roles.includes('mentor'));
    const mentees = mockUsers.filter(u => u.roles.includes('mentee'));
    const completedSessions = mockSessions.filter(s => s.status === 'completed');
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get likes data
    const totalLikes = likesService.getTotalLikesCount();

    // Calculate stats
    const calculatedStats: DashboardStats = {
      totalUsers: mockUsers.length,
      totalMentors: mentors.length,
      totalMentees: mentees.length,
      totalArticles: mockKnowledgeArticles.length,
      totalSessions: mockSessions.length,
      completedSessions: completedSessions.length,
      totalLikes: mockKnowledgeArticles.reduce((sum, a) => sum + a.likes, 0) + totalLikes,
      totalViews: mockKnowledgeArticles.reduce((sum, a) => sum + a.views, 0),
      newUsersThisMonth: mockUsers.filter(u => u.createdAt >= thisMonth).length,
      activeSessionsToday: mockSessions.filter(s => {
        if (!s.scheduledAt) return false;
        const sessionDate = new Date(s.scheduledAt);
        return sessionDate.toDateString() === today.toDateString() && s.status === 'ongoing';
      }).length
    };

    setStats(calculatedStats);

    // Get popular articles
    const articles = mockKnowledgeArticles.map(article => {
      const additionalLikes = likesService.getLikesCount(article.id);
      return {
        id: article.id,
        title: article.title,
        author: article.author.name,
        likes: article.likes + additionalLikes,
        views: article.views
      };
    }).sort((a, b) => b.likes - a.likes).slice(0, 5);

    setPopularArticles(articles);

    // Get recent sessions
    const recent = mockSessions
      .filter(s => s.scheduledAt !== undefined)
      .sort((a, b) => new Date(b.scheduledAt!).getTime() - new Date(a.scheduledAt!).getTime())
      .slice(0, 5)
      .map(session => ({
        id: session.id,
        mentor: session.mentor.user.name,
        mentee: session.mentee.name,
        type: session.type,
        status: session.status,
        scheduledAt: session.scheduledAt!
      }));

    setRecentSessions(recent);
  }, [user, router]);

  const handleSessionReaction = (sessionId: string, reactionData: Omit<AdminReaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    adminReactionService.saveReaction(sessionId, reactionData);
    setShowReactionPanel(false);
    setSelectedSession(null);
  };

  const openReactionPanel = (session: MentoringSession) => {
    const existingReaction = adminReactionService.getReaction(session.id);
    const sessionWithReaction = { ...session, adminReaction: existingReaction };
    setSelectedSession(sessionWithReaction);
    setShowReactionPanel(true);
  };

  const openMentorEditor = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setShowMentorEditor(true);
  };

  const handleMentorProfileSave = (updatedMentor: MentorProfile) => {
    mentorProfileService.updateMentorProfile(updatedMentor.id, updatedMentor);
    setShowMentorEditor(false);
    setSelectedMentor(null);
    
    // Force re-render by updating the page (in a real app, you'd update state)
    window.location.reload();
  };

  if (!user || !user.roles.includes('admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理ダッシュボード</h1>
          <p className="text-gray-600">プラットフォームの利用状況を一覧で確認できます</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">
                +{stats.newUsersThisMonth} 今月
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <p className="text-gray-600 text-sm mt-1">総ユーザー数</p>
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              メンター: {stats.totalMentors} / メンティー: {stats.totalMentees}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">
                {stats.activeSessionsToday} 本日
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalSessions}</h3>
            <p className="text-gray-600 text-sm mt-1">総セッション数</p>
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              完了済み: {stats.completedSessions} ({Math.round((stats.completedSessions / stats.totalSessions) * 100)}%)
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalArticles}</h3>
            <p className="text-gray-600 text-sm mt-1">ナレッジ記事数</p>
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              総閲覧数: {stats.totalViews.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ThumbsUp className="h-6 w-6 text-yellow-600" />
              </div>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalLikes}</h3>
            <p className="text-gray-600 text-sm mt-1">総Good数</p>
            <div className="mt-3 pt-3 border-t text-sm text-gray-500">
              平均: {stats.totalArticles > 0 ? Math.round(stats.totalLikes / stats.totalArticles) : 0} Good/記事
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Articles */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">人気の記事</h2>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {article.author}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {article.likes}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {article.views}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">最近のセッション</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentSessions.map(session => {
                  const fullSession = mockSessions.find(s => s.id === session.id);
                  const hasReaction = adminReactionService.getReaction(session.id);
                  
                  return (
                    <div key={session.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {session.mentor} → {session.mentee}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.type === 'long-term' 
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {session.type === 'long-term' ? '長期' : 'フラッシュ'}
                          </span>
                          {hasReaction && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              反応済み
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(session.scheduledAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : session.status === 'ongoing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {session.status === 'completed' ? '完了' : 
                           session.status === 'ongoing' ? '進行中' : '予定'}
                        </span>
                        {fullSession && session.status === 'completed' && (
                          <button
                            onClick={() => openReactionPanel(fullSession)}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center"
                            title="反応を残す"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            {hasReaction ? '編集' : '反応'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Management Section */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">メンター管理</h2>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMentorProfiles.map(mentor => (
                <div key={mentor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {mentor.user.avatarUrl ? (
                        <Image
                          src={mentor.user.avatarUrl}
                          alt={mentor.user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {mentor.user.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs text-gray-600">
                          {mentor.rating} ({mentor.reviewCount}件)
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                          mentor.rank === 'platinum' ? 'bg-gray-100 text-gray-800' :
                          mentor.rank === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                          mentor.rank === 'silver' ? 'bg-gray-100 text-gray-600' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {mentor.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => openMentorEditor(mentor)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      編集
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">プラットフォーム活動</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {mockMentorProfiles.length}
                </h3>
                <p className="text-sm text-gray-600 mt-1">アクティブメンター</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.newUsersThisMonth}
                </h3>
                <p className="text-sm text-gray-600 mt-1">今月の新規ユーザー</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {mockSessions.reduce((sum, s) => sum + (s.duration || 0), 0)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">総メンタリング時間（分）</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Reaction Panel */}
        {showReactionPanel && selectedSession && user && (
          <SessionReactionPanel
            session={selectedSession}
            admin={user}
            onReactionSave={handleSessionReaction}
            onClose={() => {
              setShowReactionPanel(false);
              setSelectedSession(null);
            }}
          />
        )}

        {/* Mentor Profile Editor */}
        {showMentorEditor && selectedMentor && (
          <MentorProfileEditor
            mentor={selectedMentor}
            onSave={handleMentorProfileSave}
            onClose={() => {
              setShowMentorEditor(false);
              setSelectedMentor(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
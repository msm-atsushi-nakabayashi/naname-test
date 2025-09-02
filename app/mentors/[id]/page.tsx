'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Star, Award, MapPin, Briefcase, Mail, MessageSquare, Users, ChevronLeft, Check } from 'lucide-react';
import { mockMentorProfiles } from '@/lib/data/mock';
import { getRankLabel, getRankColor, formatDate } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function MentorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingType, setBookingType] = useState<'flash' | 'long-term'>('flash');
  const [message, setMessage] = useState('');

  const mentor = mockMentorProfiles.find(m => m.id === params.id);

  if (!mentor) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">メンターが見つかりません</h1>
            <Link href="/mentors" className="text-blue-600 hover:text-blue-800">
              メンター一覧に戻る
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(`予約が完了しました！\n日付: ${formatDate(selectedDate)}\n時間: ${selectedTime}\nタイプ: ${bookingType === 'flash' ? 'フラッシュメンタリング' : '長期メンタリング'}`);
      setShowBookingModal(false);
      router.push('/mentoring');
    }
  };

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Link href="/mentors" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          メンター一覧に戻る
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-6">
                <img
                  src={mentor.user.avatarUrl}
                  alt={mentor.user.name}
                  className="h-24 w-24 rounded-full"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{mentor.user.name}</h1>
                  <p className="text-gray-600 mt-1">{mentor.user.department}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{mentor.rating}</span>
                      <span className="text-gray-500 ml-1">({mentor.reviewCount}件のレビュー)</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankColor(mentor.rank)}`}>
                      <Award className="h-4 w-4 mr-1" />
                      {getRankLabel(mentor.rank)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Self Introduction */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">自己紹介</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{mentor.selfIntroduction}</p>
            </div>

            {/* Skills & Specialties */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">スキル・専門分野</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">経歴</h2>
              <div className="flex items-start space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                <p className="text-gray-700 whitespace-pre-wrap">{mentor.experience}</p>
              </div>
            </div>

            {/* Recommendations */}
            {mentor.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">推薦コメント</h2>
                <div className="space-y-4">
                  {mentor.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-gray-700 italic">&ldquo;{rec.content}&rdquo;</p>
                      <div className="flex items-center mt-2">
                        <img
                          src={rec.author.avatarUrl}
                          alt={rec.author.name}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{rec.author.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(rec.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">メンタリング予約</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">対応可能なメンタリング</p>
                  <div className="space-y-2">
                    {mentor.availableForFlash && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">フラッシュメンタリング（30分）</span>
                      </div>
                    )}
                    {mentor.availableForLongTerm && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">長期メンタリング（月4回）</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">実績</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-lg font-bold text-gray-900">{mentor.sessionsCompleted}</p>
                      <p className="text-xs text-gray-600">セッション完了</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-lg font-bold text-gray-900">{mentor.mentees.length}</p>
                      <p className="text-xs text-gray-600">メンティー</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  相談を予約する
                </button>

                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  メッセージを送る
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">活動統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">返信率</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">平均返信時間</span>
                  <span className="font-medium">2時間</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">継続率</span>
                  <span className="font-medium">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">メンタリング予約</h2>
                <p className="text-gray-600 mt-1">{mentor.user.name}さんとのセッション</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Booking Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メンタリングタイプ
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {mentor.availableForFlash && (
                      <button
                        onClick={() => setBookingType('flash')}
                        className={`p-4 border rounded-lg text-left ${
                          bookingType === 'flash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <Clock className="h-5 w-5 text-blue-500 mb-2" />
                        <p className="font-medium">フラッシュメンタリング</p>
                        <p className="text-sm text-gray-600">30分の単発相談</p>
                      </button>
                    )}
                    {mentor.availableForLongTerm && (
                      <button
                        onClick={() => setBookingType('long-term')}
                        className={`p-4 border rounded-lg text-left ${
                          bookingType === 'long-term' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <Calendar className="h-5 w-5 text-blue-500 mb-2" />
                        <p className="font-medium">長期メンタリング</p>
                        <p className="text-sm text-gray-600">月4回の定期相談</p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日付を選択
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {availableDates.slice(0, 28).map((date, index) => {
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      return (
                        <button
                          key={index}
                          onClick={() => !isWeekend && setSelectedDate(date)}
                          disabled={isWeekend}
                          className={`
                            p-2 rounded text-sm
                            ${isWeekend ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                              isSelected ? 'bg-blue-500 text-white' : 
                              'hover:bg-gray-100 text-gray-700'}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      時間を選択
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            px-3 py-2 rounded text-sm
                            ${selectedTime === time ? 
                              'bg-blue-500 text-white' : 
                              'border border-gray-300 hover:bg-gray-50'}
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    相談内容（任意）
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="相談したい内容を簡単に記入してください..."
                  />
                </div>
              </div>

              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                  className={`
                    px-4 py-2 rounded-lg transition-colors flex items-center
                    ${selectedDate && selectedTime ? 
                      'bg-blue-600 text-white hover:bg-blue-700' : 
                      'bg-gray-300 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  <Check className="h-4 w-4 mr-2" />
                  予約を確定する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
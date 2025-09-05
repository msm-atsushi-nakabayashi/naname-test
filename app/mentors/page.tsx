'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Star, Award, Calendar, Clock, Check } from 'lucide-react';
import { mockMentorProfiles } from '@/lib/data/mock';
import { getRankLabel, getRankColor, cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Booking Button Component
interface BookingButtonProps {
  mentor: {
    user: {
      name: string;
    };
  };
}

function BookingButton({ mentor }: BookingButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // 一時的に予約を保存（リロードで消えます）
      const newBooking = {
        id: `temp-${Date.now()}`,
        mentorName: mentor.user.name,
        date: selectedDate,
        time: selectedTime
      };
      
      
      // localStorageに一時保存（デモ用）
      const existingBookings = JSON.parse(localStorage.getItem('tempBookings') || '[]');
      localStorage.setItem('tempBookings', JSON.stringify([...existingBookings, newBooking]));
      
      alert(`予約が完了しました！\n\nメンター: ${mentor.user.name}\n日付: ${formatDate(selectedDate)}\n時間: ${selectedTime}\n\n（デモ用：リロードで消えます）`);
      setShowModal(false);
      setSelectedDate(null);
      setSelectedTime('');
    }
  };

  // 現在の日付から30日分の日付を生成
  const today = new Date();
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  // 現在の月を取得
  const currentMonth = availableDates[0].toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
      >
        相談予約
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">相談予約</h2>
              <p className="text-gray-600 mt-1">{mentor.user.name}さん</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  日付を選択（{currentMonth}）
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  {/* 空白セルを追加してカレンダーを正しく配置 */}
                  {Array.from({ length: availableDates[0].getDay() }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {availableDates.slice(0, 28 - availableDates[0].getDay()).map((date, index) => {
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isToday = date.toDateString() === today.toDateString();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={index}
                        onClick={() => !isWeekend && setSelectedDate(date)}
                        disabled={isWeekend}
                        className={`
                          p-1 text-sm rounded relative
                          ${isWeekend ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                            isSelected ? 'bg-blue-500 text-white' : 
                            isToday ? 'bg-yellow-100 text-gray-700 font-bold' :
                            'hover:bg-gray-100 text-gray-700'}
                        `}
                      >
                        {date.getDate()}
                        {isToday && <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                          px-2 py-1 text-sm rounded
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
            </div>

            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`
                  px-4 py-2 rounded-lg flex items-center
                  ${selectedDate && selectedTime ? 
                    'bg-blue-600 text-white hover:bg-blue-700' : 
                    'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
              >
                <Check className="h-4 w-4 mr-2" />
                予約確定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRank, setSelectedRank] = useState<string>('');

  const allSkills = Array.from(
    new Set(mockMentorProfiles.flatMap(m => m.skills))
  );

  const filteredMentors = mockMentorProfiles.filter(mentor => {
    const matchesSearch = searchQuery === '' || 
      mentor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.selfIntroduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill => mentor.skills.includes(skill));

    const matchesRank = selectedRank === '' || mentor.rank === selectedRank;

    return matchesSearch && matchesSkills && matchesRank;
  });

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">メンター一覧</h1>
        <p className="mt-2 text-gray-600">あなたに合ったメンターを見つけましょう</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="名前、スキル、紹介文で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スキルで絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSelectedSkills(prev =>
                        prev.includes(skill)
                          ? prev.filter(s => s !== skill)
                          : [...prev, skill]
                      );
                    }}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      selectedSkills.includes(skill)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ランク
              </label>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">すべて</option>
                <option value="bronze">ブロンズ</option>
                <option value="silver">シルバー</option>
                <option value="gold">ゴールド</option>
                <option value="platinum">プラチナ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <Image
                  src={mentor.user.avatarUrl || '/default-avatar.png'}
                  alt={mentor.user.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mentor.user.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {mentor.rating} ({mentor.reviewCount}件)
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(mentor.rank)}`}>
                      <Award className="h-3 w-3 mr-1" />
                      {getRankLabel(mentor.rank)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {mentor.selfIntroduction}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {skill}
                    </span>
                  ))}
                  {mentor.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{mentor.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {mentor.availableForFlash && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>単発相談可</span>
                    </div>
                  )}
                  {mentor.availableForLongTerm && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>長期可</span>
                    </div>
                  )}
                </div>
              </div>

              {mentor.recommendations.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">推薦コメント</p>
                  <p className="text-xs text-gray-600 italic line-clamp-2">
                    &ldquo;{mentor.recommendations[0].content}&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    - {mentor.recommendations[0].author.name}
                  </p>
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  詳細を見る
                </Link>
                {mentor.availableForFlash && (
                  <BookingButton mentor={mentor} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">該当するメンターが見つかりませんでした</p>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
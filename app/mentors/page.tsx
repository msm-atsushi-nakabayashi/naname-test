'use client';

import { useState } from 'react';
import { Search, Filter, Star, Award, Calendar, Clock } from 'lucide-react';
import { mockMentorProfiles } from '@/lib/data/mock';
import { getRankLabel, getRankColor, cn } from '@/lib/utils';
import Link from 'next/link';

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
                <img
                  src={mentor.user.avatarUrl}
                  alt={mentor.user.name}
                  className="h-16 w-16 rounded-full"
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
                    "{mentor.recommendations[0].content}"
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
                  <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                    相談予約
                  </button>
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
  );
}
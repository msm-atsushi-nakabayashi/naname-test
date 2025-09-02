'use client';

import { useState } from 'react';
import { Search, Filter, ThumbsUp, Eye, Tag, Edit, Plus, TrendingUp, BookOpen } from 'lucide-react';
import { mockKnowledgeArticles, currentUser } from '@/lib/data/mock';
import { formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent');
  const [showEditor, setShowEditor] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const allTags = Array.from(
    new Set(mockKnowledgeArticles.flatMap(a => a.tags))
  );

  const filteredArticles = mockKnowledgeArticles
    .filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => article.tags.includes(tag));

      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === 'popular') {
        return b.likes - a.likes;
      } else {
        return b.views - a.views;
      }
    });

  const handleCreateArticle = () => {
    console.log('Creating article:', newArticle);
    alert('記事が投稿されました！（モック）');
    setShowEditor(false);
    setNewArticle({ title: '', content: '', tags: [] });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ナレッジベース</h1>
          <p className="mt-2 text-gray-600">メンタリングで得た知見を共有しましょう</p>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showEditor ? (
            <>キャンセル</>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              記事を投稿
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">記事数</p>
              <p className="text-xl font-bold text-gray-900">{mockKnowledgeArticles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">総閲覧数</p>
              <p className="text-xl font-bold text-gray-900">
                {mockKnowledgeArticles.reduce((sum, a) => sum + a.views, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">総いいね数</p>
              <p className="text-xl font-bold text-gray-900">
                {mockKnowledgeArticles.reduce((sum, a) => sum + a.likes, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">あなたの貢献</p>
              <p className="text-xl font-bold text-gray-900">45 ポイント</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      {showEditor && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">新しい記事を投稿</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイトル
              </label>
              <input
                type="text"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="記事のタイトルを入力..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容（Markdown対応）
              </label>
              <textarea
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48"
                placeholder="# 見出し&#10;&#10;記事の内容を入力..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タグ
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setNewArticle(prev => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter(t => t !== tag)
                          : [...prev.tags, tag]
                      }));
                    }}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      newArticle.tags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowEditor(false);
                  setNewArticle({ title: '', content: '', tags: [] });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreateArticle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                投稿する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグで絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <Tag className="inline h-3 w-3 mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び替え
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">最新順</option>
                <option value="popular">人気順</option>
                <option value="views">閲覧数順</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              
              <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="h-6 w-6 rounded-full"
                />
                <span>{article.author.name}</span>
                <span>•</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {article.content.replace(/[#*`]/g, '')}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {article.views}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {article.likes}
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  続きを読む →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">該当する記事が見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
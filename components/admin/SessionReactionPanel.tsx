'use client';

import { useState } from 'react';
import { Star, Save, X, CheckCircle } from 'lucide-react';
import { MentoringSession, AdminReaction, User } from '@/lib/types';

interface SessionReactionPanelProps {
  session: MentoringSession;
  admin: User;
  onReactionSave: (sessionId: string, reaction: Omit<AdminReaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const REACTION_TAGS = [
  { id: 'excellent', label: '優秀', color: 'bg-green-100 text-green-700' },
  { id: 'creative', label: '創造的', color: 'bg-purple-100 text-purple-700' },
  { id: 'needs-improvement', label: '改善必要', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'well-structured', label: '構造的', color: 'bg-blue-100 text-blue-700' },
  { id: 'engaged-mentee', label: 'メンティー積極的', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'clear-goals', label: '目標明確', color: 'bg-teal-100 text-teal-700' }
];

export default function SessionReactionPanel({ session, admin, onReactionSave, onClose }: SessionReactionPanelProps) {
  const [rating, setRating] = useState<number>(session.adminReaction?.rating || 0);
  const [comment, setComment] = useState(session.adminReaction?.comment || '');
  const [recommendation, setRecommendation] = useState(session.adminReaction?.recommendation || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(session.adminReaction?.tags || []);
  const [saving, setSaving] = useState(false);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    if (rating === 0 || comment.trim() === '') {
      alert('評価とコメントは必須です');
      return;
    }

    setSaving(true);
    try {
      const reactionData = {
        sessionId: session.id,
        adminId: admin.id,
        admin,
        rating,
        comment: comment.trim(),
        recommendation: recommendation.trim() || undefined,
        tags: selectedTags
      };

      onReactionSave(session.id, reactionData);
      onClose();
    } catch (error) {
      console.error('Failed to save reaction:', error);
      alert('反応の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">セッション反応</h2>
            <p className="text-sm text-gray-600 mt-1">
              {session.mentor.user.name} → {session.mentee.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">セッション情報</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                session.type === 'long-term' 
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {session.type === 'long-term' ? '長期メンタリング' : 'フラッシュメンタリング'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              日時: {session.scheduledAt?.toLocaleString('ja-JP')}
            </p>
            {session.duration && (
              <p className="text-sm text-gray-600">
                時間: {session.duration}分
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              セッション評価 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating}/5`}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              セッションの特徴
            </label>
            <div className="flex flex-wrap gap-2">
              {REACTION_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag.id)
                      ? tag.color
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              コメント <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="セッションの内容や質について具体的なフィードバックを記載してください..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              改善提案（任意）
            </label>
            <textarea
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="今後のメンタリングに向けた具体的な提案があれば記載してください..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Existing Reaction Display */}
          {session.adminReaction && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">
                  既存の反応を編集中
                </span>
              </div>
              <p className="text-sm text-blue-800">
                最終更新: {session.adminReaction.updatedAt.toLocaleString('ja-JP')}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving || rating === 0 || comment.trim() === ''}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {session.adminReaction ? '更新' : '保存'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
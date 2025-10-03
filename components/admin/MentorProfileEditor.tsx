'use client';

import { useState } from 'react';
import { Save, X, User, Star, Award, Clock } from 'lucide-react';
import { MentorProfile } from '@/lib/types';
import ImageUpload from './ImageUpload';

interface MentorProfileEditorProps {
  mentor: MentorProfile;
  onSave: (updatedMentor: MentorProfile) => void;
  onClose: () => void;
}

export default function MentorProfileEditor({ mentor, onSave, onClose }: MentorProfileEditorProps) {
  const [formData, setFormData] = useState({
    selfIntroduction: mentor.selfIntroduction,
    skills: mentor.skills.join(', '),
    specialties: mentor.specialties.join(', '),
    experience: mentor.experience,
    availableForFlash: mentor.availableForFlash,
    availableForLongTerm: mentor.availableForLongTerm,
    avatarUrl: mentor.user.avatarUrl || ''
  });
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.selfIntroduction.trim()) {
      newErrors.selfIntroduction = '自己紹介は必須です';
    }

    if (!formData.skills.trim()) {
      newErrors.skills = 'スキルは必須です';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = '経験は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: imageUrl || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Create updated mentor profile
      const updatedMentor: MentorProfile = {
        ...mentor,
        selfIntroduction: formData.selfIntroduction.trim(),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        experience: formData.experience.trim(),
        availableForFlash: formData.availableForFlash,
        availableForLongTerm: formData.availableForLongTerm,
        user: {
          ...mentor.user,
          avatarUrl: formData.avatarUrl || undefined
        }
      };

      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(updatedMentor);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                メンタープロフィール編集
              </h2>
              <p className="text-sm text-gray-600">{mentor.user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Upload */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">プロフィール画像</h3>
                <ImageUpload
                  currentImage={formData.avatarUrl}
                  onImageChange={handleImageChange}
                />
              </div>

              {/* Mentor Stats */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">メンター統計</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      評価
                    </span>
                    <span className="font-medium">{mentor.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Award className="h-4 w-4 mr-1 text-purple-500" />
                      ランク
                    </span>
                    <span className="font-medium capitalize">{mentor.rank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1 text-green-500" />
                      完了セッション
                    </span>
                    <span className="font-medium">{mentor.sessionsCompleted}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Self Introduction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自己紹介 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.selfIntroduction}
                  onChange={(e) => setFormData(prev => ({ ...prev, selfIntroduction: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.selfIntroduction ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="メンターとしての経験や強みを記載してください..."
                />
                {errors.selfIntroduction && (
                  <p className="mt-1 text-sm text-red-600">{errors.selfIntroduction}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  スキル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.skills ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="React, TypeScript, Node.js （カンマ区切り）"
                />
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">カンマ区切りで入力してください</p>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  専門分野
                </label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="フロントエンド開発, UI/UX設計 （カンマ区切り）"
                />
                <p className="mt-1 text-sm text-gray-500">カンマ区切りで入力してください</p>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  経験・実績 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.experience ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="これまでの経験や実績を記載してください..."
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  メンタリング対応可能種類
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableForFlash}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableForFlash: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      フラッシュメンタリング（短時間の相談）
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableForLongTerm}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableForLongTerm: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      長期メンタリング（継続的なサポート）
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  className?: string;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  className = '',
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `サポートされていないファイル形式です。${acceptedFormats.map(f => f.split('/')[1]).join(', ')}のみ対応しています。`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `ファイルサイズが大きすぎます。最大${maxSize}MBまでです。`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // In a real application, you would upload to a storage service like:
      // - AWS S3
      // - Cloudinary
      // - Firebase Storage
      // - Supabase Storage
      
      // For demo purposes, we'll simulate the upload and use the local preview
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload delay
      
      // Generate a mock URL (in real app, this would be the uploaded file URL)
      const mockUploadedUrl = `/uploads/mentor-${Date.now()}-${file.name}`;
      
      onImageChange(mockUploadedUrl);
      
      // Clean up the preview URL
      if (previewUrl !== mockUploadedUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
    } catch (err) {
      setError('画像のアップロードに失敗しました。もう一度お試しください。');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageChange(null);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {preview && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={preview}
              alt="Profile preview"
              fill
              className="object-cover"
            />
          </div>
          {!uploading && (
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="画像を削除"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            {preview ? (
              <Camera className="h-12 w-12 text-gray-400" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {preview ? '画像を変更' : 'プロフィール画像をアップロード'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ファイルをドラッグ&ドロップするか、クリックして選択
            </p>
          </div>

          <button
            onClick={triggerFileSelect}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {uploading ? 'アップロード中...' : 'ファイルを選択'}
          </button>

          <p className="text-xs text-gray-400">
            {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 形式、最大 {maxSize}MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• 推奨サイズ: 400x400px以上の正方形</p>
        <p>• 顔がはっきりと見える写真を使用してください</p>
        <p>• プロフェッショナルな印象を与える写真が効果的です</p>
      </div>
    </div>
  );
}
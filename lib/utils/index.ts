import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function getRankColor(rank: string): string {
  switch (rank) {
    case 'bronze':
      return 'text-orange-600 bg-orange-100';
    case 'silver':
      return 'text-gray-600 bg-gray-100';
    case 'gold':
      return 'text-yellow-600 bg-yellow-100';
    case 'platinum':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getRankLabel(rank: string): string {
  switch (rank) {
    case 'bronze':
      return 'ブロンズ';
    case 'silver':
      return 'シルバー';
    case 'gold':
      return 'ゴールド';
    case 'platinum':
      return 'プラチナ';
    default:
      return '未設定';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'approved':
      return 'text-blue-600 bg-blue-100';
    case 'ongoing':
      return 'text-green-600 bg-green-100';
    case 'completed':
      return 'text-gray-600 bg-gray-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return '承認待ち';
    case 'approved':
      return '承認済み';
    case 'ongoing':
      return '進行中';
    case 'completed':
      return '完了';
    case 'cancelled':
      return 'キャンセル';
    default:
      return '未設定';
  }
}
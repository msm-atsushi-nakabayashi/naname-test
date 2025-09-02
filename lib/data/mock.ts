import { User, MentorProfile, MentoringSession, KnowledgeArticle, Schedule } from '@/lib/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: '山田太郎',
    roles: ['admin'],
    department: '経営企画部',
    createdAt: new Date('2024-01-01'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: '2',
    email: 'tanaka@company.com',
    name: '田中花子',
    roles: ['mentor', 'mentee'],
    department: 'エンジニアリング部',
    invitedBy: '1',
    invitedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka'
  },
  {
    id: '3',
    email: 'suzuki@company.com',
    name: '鈴木一郎',
    roles: ['mentor'],
    department: 'インフラ部',
    invitedBy: '1',
    invitedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki'
  },
  {
    id: '4',
    email: 'sato@company.com',
    name: '佐藤美咲',
    roles: ['mentee'],
    department: 'エンジニアリング部',
    invitedBy: '2',
    invitedAt: new Date('2024-02-01'),
    createdAt: new Date('2024-02-01'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sato'
  },
  {
    id: '5',
    email: 'watanabe@company.com',
    name: '渡辺健太',
    roles: ['mentor', 'mentee'],
    department: 'プロダクト部',
    invitedBy: '1',
    invitedAt: new Date('2024-02-10'),
    createdAt: new Date('2024-02-10'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=watanabe'
  }
];

export const mockMentorProfiles: MentorProfile[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers[1],
    selfIntroduction: 'フロントエンド開発を10年以上経験し、React、Vue.js、Next.jsなどのモダンなフレームワークに精通しています。チーム開発の経験も豊富で、若手エンジニアの成長をサポートすることに情熱を持っています。',
    skills: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Node.js'],
    specialties: ['フロントエンド開発', 'パフォーマンス最適化', 'アーキテクチャ設計'],
    experience: '10年以上のWeb開発経験。大規模ECサイトの開発リーダー、スタートアップでのCTO経験あり。',
    recommendations: [
      {
        id: '1',
        mentorId: '1',
        authorId: '1',
        author: mockUsers[0],
        content: '田中さんは技術力が高いだけでなく、メンティーの立場に立って丁寧に説明してくれる素晴らしいメンターです。',
        isApproved: true,
        createdAt: new Date('2024-02-01')
      },
      {
        id: '2',
        mentorId: '1',
        authorId: '4',
        author: mockUsers[3],
        content: 'とても親身になって相談に乗ってくださいました。技術的な質問だけでなく、キャリアの相談もできて助かりました。',
        isApproved: true,
        createdAt: new Date('2024-03-01')
      }
    ],
    rating: 4.8,
    reviewCount: 12,
    points: 2500,
    rank: 'gold',
    availableForFlash: true,
    availableForLongTerm: true,
    sessionsCompleted: 48,
    mentees: ['4', '5'],
    availableSlots: [
      { dayOfWeek: 1, time: '19:00' },
      { dayOfWeek: 3, time: '19:00' },
      { dayOfWeek: 5, time: '19:00' }
    ]
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers[2],
    selfIntroduction: 'バックエンド開発のスペシャリストとして、マイクロサービスアーキテクチャやクラウドインフラの設計・構築を得意としています。',
    skills: ['Go', 'Python', 'Kubernetes', 'AWS', 'PostgreSQL'],
    specialties: ['バックエンド開発', 'インフラ構築', 'システム設計'],
    experience: '15年のエンジニア経験。金融系システムのアーキテクト、大規模Webサービスのインフラ責任者を歴任。',
    recommendations: [
      {
        id: '3',
        mentorId: '2',
        authorId: '1',
        author: mockUsers[0],
        content: '鈴木さんの深い技術知識と実践的なアドバイスは、多くのメンティーにとって貴重な学びとなっています。',
        isApproved: true,
        createdAt: new Date('2024-02-15')
      }
    ],
    rating: 4.9,
    reviewCount: 20,
    points: 3500,
    rank: 'platinum',
    availableForFlash: true,
    availableForLongTerm: false,
    sessionsCompleted: 75,
    mentees: ['1', '4'],
    availableSlots: [
      { dayOfWeek: 2, time: '18:00' },
      { dayOfWeek: 4, time: '18:00' }
    ]
  },
  {
    id: '3',
    userId: '5',
    user: mockUsers[4],
    selfIntroduction: 'プロダクトマネジメントとエンジニアリングの両方の経験を活かし、技術とビジネスの橋渡しをサポートします。',
    skills: ['Product Management', 'Agile', 'React', 'Data Analysis', 'UX Design'],
    specialties: ['プロダクトマネジメント', 'アジャイル開発', 'データ分析'],
    experience: '8年のエンジニア経験後、3年間プロダクトマネージャーとして活動。',
    recommendations: [],
    rating: 4.5,
    reviewCount: 5,
    points: 800,
    rank: 'silver',
    availableForFlash: true,
    availableForLongTerm: true,
    sessionsCompleted: 15,
    mentees: ['1'],
    availableSlots: [
      { dayOfWeek: 1, time: '20:00' },
      { dayOfWeek: 3, time: '20:00' },
      { dayOfWeek: 5, time: '19:00' }
    ]
  }
];

export const mockSessions: MentoringSession[] = [
  {
    id: '1',
    mentorId: '1',
    menteeId: '4',
    mentor: mockMentorProfiles[0],
    mentee: mockUsers[3],
    type: 'long-term',
    status: 'ongoing',
    scheduledAt: new Date('2024-03-01T10:00:00'),
    duration: 60,
    notes: [
      {
        id: '1',
        sessionId: '1',
        content: '## 本日の議題\\n- Reactのパフォーマンス最適化について\\n- useMemとuseCallbackの使い分け\\n\\n## 次回までの課題\\n- パフォーマンス計測ツールの実践',
        lastEditedBy: '2',
        lastEditedAt: new Date('2024-03-01T11:00:00'),
        createdAt: new Date('2024-03-01T10:00:00')
      }
    ],
    createdAt: new Date('2024-02-20')
  },
  {
    id: '2',
    mentorId: '2',
    menteeId: '4',
    mentor: mockMentorProfiles[1],
    mentee: mockUsers[3],
    type: 'flash',
    status: 'completed',
    scheduledAt: new Date('2024-02-15T14:00:00'),
    duration: 30,
    review: {
      id: '1',
      sessionId: '2',
      mentorId: '2',
      menteeId: '4',
      rating: 5,
      comment: 'Docker環境構築について、とてもわかりやすく教えていただきました。実践的なTipsも教えていただき、大変勉強になりました。',
      createdAt: new Date('2024-02-15T15:00:00')
    },
    createdAt: new Date('2024-02-10')
  }
];

export const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'React 18の新機能とパフォーマンス最適化テクニック',
    content: '# React 18の新機能\\n\\nReact 18では、Concurrent Renderingを始めとする革新的な機能が導入されました...\\n\\n## Suspenseの活用\\n\\nSuspenseを使用することで、非同期処理をより宣言的に扱うことができます...',
    authorId: '2',
    author: mockUsers[1],
    tags: ['React', 'パフォーマンス', 'フロントエンド'],
    likes: 24,
    views: 156,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '2',
    title: 'Kubernetesでのマイクロサービス運用のベストプラクティス',
    content: '# Kubernetesでのマイクロサービス運用\\n\\n本記事では、実際のプロダクション環境でKubernetesを運用する際のベストプラクティスを紹介します...\\n\\n## ヘルスチェックの実装\\n\\n適切なヘルスチェックは、サービスの安定性に直結します...',
    authorId: '3',
    author: mockUsers[2],
    tags: ['Kubernetes', 'マイクロサービス', 'インフラ'],
    likes: 32,
    views: 241,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: '効果的な1on1ミーティングの進め方',
    content: '# 効果的な1on1ミーティング\\n\\n1on1ミーティングは、メンター・メンティー間の信頼関係構築に重要な役割を果たします...\\n\\n## アジェンダの準備\\n\\n事前にアジェンダを共有することで、有意義な時間を過ごすことができます...',
    authorId: '5',
    author: mockUsers[4],
    tags: ['メンタリング', 'コミュニケーション', 'マネジメント'],
    likes: 18,
    views: 98,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

export const mockSchedules: Schedule[] = [
  {
    id: '1',
    mentorId: '1',
    dayOfWeek: 1, // Monday
    startTime: '10:00',
    endTime: '12:00',
    isAvailable: true
  },
  {
    id: '2',
    mentorId: '1',
    dayOfWeek: 3, // Wednesday
    startTime: '14:00',
    endTime: '16:00',
    isAvailable: true
  },
  {
    id: '3',
    mentorId: '2',
    dayOfWeek: 2, // Tuesday
    startTime: '13:00',
    endTime: '15:00',
    isAvailable: true
  },
  {
    id: '4',
    mentorId: '2',
    dayOfWeek: 4, // Thursday
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: true
  }
];

// Current logged in user (mock)
export const currentUser: User = mockUsers[3]; // 佐藤美咲 (mentee)
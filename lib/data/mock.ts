import { User, MentorProfile, MentoringSession, KnowledgeArticle, Schedule, UserRole, MentorRank } from '@/lib/types';
import usersData from '@/data/users.json';
import mentorsData from '@/data/mentors.json';

// JSONファイルからユーザーデータを読み込み、Dateオブジェクトに変換
const now = new Date();
const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 15);
const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);

export const mockUsers: User[] = usersData.users.map(user => ({
  ...user,
  roles: user.roles as UserRole[],
  createdAt: threeMonthsAgo,
  invitedAt: user.id !== '1' ? twoMonthsAgo : undefined,
  invitedBy: user.id === '2' || user.id === '3' || user.id === '5' ? '6' : user.id === '4' ? '2' : undefined
}));

// JSONファイルからメンタープロファイルを読み込み、userオブジェクトを関連付け
export const mockMentorProfiles: MentorProfile[] = mentorsData.mentorProfiles.map(mentor => {
  const user = mockUsers.find(u => u.id === mentor.userId);
  return {
    ...mentor,
    rank: mentor.rank as MentorRank,
    user: user!,
    recommendations: [
      ...(mentor.id === '1' ? [
        {
          id: '1',
          mentorId: '1',
          authorId: '1',
          author: mockUsers[0],
          content: '田中さんは技術力が高いだけでなく、メンティーの立場に立って丁寧に説明してくれる素晴らしいメンターです。',
          isApproved: true,
          createdAt: twoMonthsAgo
        },
        {
          id: '2',
          mentorId: '1',
          authorId: '4',
          author: mockUsers[3],
          content: 'とても親身になって相談に乗ってくださいました。技術的な質問だけでなく、キャリアの相談もできて助かりました。',
          isApproved: true,
          createdAt: oneMonthAgo
        }
      ] : []),
      ...(mentor.id === '2' ? [
        {
          id: '3',
          mentorId: '2',
          authorId: '1',
          author: mockUsers[0],
          content: '鈴木さんの深い技術知識と実践的なアドバイスは、多くのメンティーにとって貴重な学びとなっています。',
          isApproved: true,
          createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 15)
        }
      ] : [])
    ]
  };
});

// 現在からの相対日付でセッションデータを生成
const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
const twoWeeksAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
const threeWeeksAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 21);
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0, 0);
const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 10, 0, 0);

export const mockSessions: MentoringSession[] = [
  {
    id: '1',
    mentorId: '1',
    menteeId: '1',  // 中林篤史
    mentor: mockMentorProfiles[0],  // 田中花子
    mentee: mockUsers[0],
    type: 'long-term',
    status: 'ongoing',
    scheduledAt: tomorrow,
    duration: 60,
    notes: [
      {
        id: '1',
        sessionId: '1',
        content: '## 本日の議題\\n- Reactのパフォーマンス最適化について\\n- useMemoとuseCallbackの使い分け\\n\\n## 次回までの課題\\n- パフォーマンス計測ツールの実践',
        lastEditedBy: '2',
        lastEditedAt: oneWeekAgo,
        createdAt: oneWeekAgo
      }
    ],
    createdAt: threeWeeksAgo
  },
  {
    id: '3',
    mentorId: '1',
    menteeId: '1',  // 中林篤史
    mentor: mockMentorProfiles[0],  // 田中花子
    mentee: mockUsers[0],
    type: 'flash',
    status: 'ongoing',
    scheduledAt: nextWeek,
    duration: 30,
    createdAt: twoWeeksAgo
  },
  {
    id: '2',
    mentorId: '2',
    menteeId: '4',
    mentor: mockMentorProfiles[1],
    mentee: mockUsers[3],
    type: 'flash',
    status: 'completed',
    scheduledAt: twoWeeksAgo,
    duration: 30,
    review: {
      id: '1',
      sessionId: '2',
      mentorId: '2',
      menteeId: '4',
      rating: 5,
      comment: 'Docker環境構築について、とてもわかりやすく教えていただきました。実践的なTipsも教えていただき、大変勉強になりました。',
      createdAt: twoWeeksAgo
    },
    createdAt: threeWeeksAgo
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
    createdAt: twoMonthsAgo,
    updatedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15)
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
    createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 15),
    updatedAt: new Date(now.getFullYear(), now.getMonth() - 2, 20)
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
    createdAt: oneMonthAgo,
    updatedAt: oneMonthAgo
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
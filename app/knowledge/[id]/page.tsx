'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ThumbsUp, 
  Eye, 
  Share2, 
  Bookmark, 
  MessageCircle,
  Clock,
  ChevronRight,
  Code2,
  FileText,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { mockKnowledgeArticles } from '@/lib/data/mock';
import { formatDate } from '@/lib/utils';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { likesService } from '@/lib/services/likesService';

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // 記事を取得（実際のアプリではAPIから取得）
  const article = mockKnowledgeArticles.find(a => a.id === params.id) || mockKnowledgeArticles[0];

  useEffect(() => {
    if (user && article) {
      setLiked(likesService.isLiked(article.id, user.id));
      const currentLikes = likesService.getLikesCount(article.id);
      setLikesCount(article.likes + currentLikes);
    }
  }, [user, article]);

  const handleLikeToggle = () => {
    if (!user) return;
    
    const isNowLiked = likesService.toggleLike(article.id, user.id);
    setLiked(isNowLiked);
    
    // 実際のいいね数を更新
    const currentLikes = likesService.getLikesCount(article.id);
    setLikesCount(article.likes + currentLikes);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // サンプルの関連記事
  const relatedArticles = mockKnowledgeArticles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/knowledge')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                ナレッジベースに戻る
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-lg ${bookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メインコンテンツ */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-lg shadow">
                <div className="p-8">
                  {/* タイトルとメタ情報 */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {article.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <Image
                          src={article.author.avatarUrl || '/default-avatar.png'}
                          alt={article.author.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{article.author.name}</p>
                          <p className="text-sm text-gray-500">{article.author.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(article.createdAt)}
                      </div>
                      <div className="flex items-center text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views} 閲覧
                      </div>
                      <div className="flex items-center text-sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {likesCount} Good
                      </div>
                    </div>
                  </div>

                  {/* 記事本文（リッチなサンプルコンテンツ） */}
                  <div className="prose prose-lg max-w-none">
                    <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <div className="flex items-start">
                        <Lightbulb className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">この記事で学べること</h3>
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              React 18の新機能とその活用方法
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              パフォーマンス最適化のベストプラクティス
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              実践的なコード例とその解説
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. はじめに</h2>
                    <p className="text-gray-700 mb-6">
                      React 18では、アプリケーションのパフォーマンスとユーザー体験を大幅に向上させる革新的な機能が導入されました。
                      本記事では、これらの新機能を実際のプロジェクトでどのように活用するか、具体的なコード例を交えて解説します。
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Concurrent Renderingの仕組み</h2>
                    <p className="text-gray-700 mb-4">
                      Concurrent Renderingは、React 18の中核となる機能です。この機能により、Reactは複数の更新を同時に処理し、
                      優先度に応じて適切に中断・再開することが可能になりました。
                    </p>

                    {/* 図表の例 */}
                    <div className="my-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Concurrent Renderingのフロー図
                      </h4>
                      <div className="bg-white p-4 rounded border-2 border-gray-200">
                        <div className="flex items-center justify-between space-x-4">
                          <div className="text-center p-4 bg-blue-100 rounded-lg flex-1">
                            <div className="font-bold text-blue-700">ユーザー入力</div>
                          </div>
                          <ChevronRight className="h-6 w-6 text-gray-400" />
                          <div className="text-center p-4 bg-green-100 rounded-lg flex-1">
                            <div className="font-bold text-green-700">優先度判定</div>
                          </div>
                          <ChevronRight className="h-6 w-6 text-gray-400" />
                          <div className="text-center p-4 bg-purple-100 rounded-lg flex-1">
                            <div className="font-bold text-purple-700">レンダリング</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* コードブロックの例 */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2.1 実装例</h3>
                    <p className="text-gray-700 mb-4">
                      以下は、useTransitionフックを使用した実装例です：
                    </p>
                    
                    <div className="my-6 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                        <div className="flex items-center space-x-2">
                          <Code2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">jsx</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(`import { useState, useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    startTransition(() => {
      // 重い処理をTransitionでラップ
      const filtered = heavyFilterOperation(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <Results items={results} />
    </div>
  );
}`, 'code1')}
                          className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white"
                        >
                          {copiedCode === 'code1' ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>コピー済み</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>コピー</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code className="text-gray-300">{`import { useState, useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    startTransition(() => {
      // 重い処理をTransitionでラップ
      const filtered = heavyFilterOperation(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <Results items={results} />
    </div>
  );
}`}</code>
                      </pre>
                    </div>

                    {/* 注意事項 */}
                    <div className="my-8 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">注意点</h4>
                          <p className="text-gray-700">
                            useTransitionは、非緊急の更新にのみ使用してください。
                            ユーザーの直接的な操作（クリックやキー入力）には使用しないようにしましょう。
                          </p>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Suspenseの活用</h2>
                    <p className="text-gray-700 mb-6">
                      Suspenseを使用することで、非同期処理をより宣言的に扱うことができます。
                      データフェッチングやコード分割において、ローディング状態を簡潔に管理できます。
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. まとめ</h2>
                    <p className="text-gray-700 mb-6">
                      React 18の新機能を活用することで、よりスムーズでレスポンシブなユーザー体験を提供できます。
                      本記事で紹介した技術を実際のプロジェクトに適用し、アプリケーションのパフォーマンスを向上させましょう。
                    </p>
                  </div>

                  {/* アクションバー */}
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleLikeToggle}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                            liked 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <ThumbsUp className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                          <span className="font-medium">
                            {liked ? 'Good済み' : 'Good'} ({likesCount})
                          </span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                          <MessageCircle className="h-5 w-5" />
                          <span>コメント (3)</span>
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        最終更新: {formatDate(article.updatedAt)}
                      </div>
                    </div>
                  </div>

                  {/* 著者情報 */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-4">著者について</h3>
                    <div className="flex items-start">
                      <Image
                        src={article.author.avatarUrl || '/default-avatar.png'}
                        alt={article.author.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-bold text-gray-900">{article.author.name}</h4>
                        <p className="text-gray-600">{article.author.department}</p>
                        <p className="mt-2 text-gray-700">
                          フロントエンド開発を専門とし、React、TypeScript、Next.jsなどのモダンな技術スタックに精通しています。
                          チーム開発の経験も豊富で、若手エンジニアの育成にも積極的に取り組んでいます。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              {/* 目次 */}
              <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">目次</h3>
                <nav className="space-y-2">
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800 py-1">
                    1. はじめに
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 pl-4">
                    2. Concurrent Renderingの仕組み
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 pl-8">
                    2.1 実装例
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 pl-4">
                    3. Suspenseの活用
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 pl-4">
                    4. まとめ
                  </a>
                </nav>
              </div>

              {/* 関連記事 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">関連記事</h3>
                <div className="space-y-4">
                  {relatedArticles.map(related => (
                    <Link
                      key={related.id}
                      href={`/knowledge/${related.id}`}
                      className="block p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {related.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{related.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(related.createdAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
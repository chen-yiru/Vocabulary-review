import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  RotateCcw,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  Plus,
} from 'lucide-react'
import {
  getDueVocabularies,
  getVocabularies,
  type Vocabulary,
} from '../api/vocab'
import { getReviewStats, type ReviewStats } from '../api/review'

export default function Dashboard() {
  const [dueVocabularies, setDueVocabularies] = useState<Vocabulary[]>([])
  const [recentVocabularies, setRecentVocabularies] = useState<Vocabulary[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setErrorMsg(null)

        const [dueData, recentData, statsData] = await Promise.all([
          getDueVocabularies(),
          getVocabularies({}, { page: 1, size: 5 }),
          getReviewStats(),
        ])

        setDueVocabularies(dueData)
        setRecentVocabularies(recentData.items)
        setStats(statsData)
      } catch (error: any) {
        const msg =
          error?.response?.data?.detail ||
          error?.message ||
          '讀取儀表板資料失敗'
        setErrorMsg(msg)
        console.error('[Dashboard] load error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getFamiliarityColor = (level: number) => {
    switch (level) {
      case 1:
        return 'text-danger-600'
      case 2:
        return 'text-warning-600'
      case 3:
        return 'text-yellow-500'
      case 4:
        return 'text-primary-600'
      case 5:
        return 'text-success-600'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    // 簡單 skeleton
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="ml-4 flex-1">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card">
              <div className="card-header">
                <div className="h-5 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="h-12 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
          <p className="text-gray-600">歡迎回來！開始您的學習之旅</p>
        </div>
        <Link to="/vocab" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          新增單字
        </Link>
      </div>

      {/* 錯誤訊息 */}
      {errorMsg && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-sm text-danger-700">{errorMsg}</p>
        </div>
      )}

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-4">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">總單字數</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.total_vocabularies ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">待複習</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.due_vocabularies ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今日複習</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.today_reviews ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">答對率</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round((stats?.accuracy_rate ?? 0) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待複習單字 */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title">待複習單字</h2>
                <p className="card-subtitle">
                  {dueVocabularies.length} 個單字需要複習
                </p>
              </div>
              <Link to="/review" className="btn-primary">
                <RotateCcw className="w-4 h-4 mr-2" />
                開始複習
              </Link>
            </div>
          </div>

          {dueVocabularies.length > 0 ? (
            <div className="p-4 space-y-3">
              {dueVocabularies.slice(0, 5).map((vocab) => (
                <div
                  key={vocab.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{vocab.word}</p>
                    <p className="text-sm text-gray-600">{vocab.zh_meaning}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star
                      className={`w-4 h-4 ${getFamiliarityColor(
                        vocab.familiarity
                      )}`}
                    />
                    {vocab.is_hard && (
                      <AlertCircle className="w-4 h-4 text-danger-500" />
                    )}
                  </div>
                </div>
              ))}
              {dueVocabularies.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  還有 {dueVocabularies.length - 5} 個單字待複習
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">太棒了！沒有需要複習的單字</p>
            </div>
          )}
        </div>

        {/* 最近新增的單字 */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title">最近新增</h2>
                <p className="card-subtitle">最近學習的單字</p>
              </div>
              <Link to="/vocab" className="btn-secondary">
                查看全部
              </Link>
            </div>
          </div>

          {recentVocabularies.length > 0 ? (
            <div className="p-4 space-y-3">
              {recentVocabularies.map((vocab) => (
                <div
                  key={vocab.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{vocab.word}</p>
                    <p className="text-sm text-gray-600">{vocab.zh_meaning}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star
                      className={`w-4 h-4 ${getFamiliarityColor(
                        vocab.familiarity
                      )}`}
                    />
                    {vocab.is_hard && (
                      <AlertCircle className="w-4 h-4 text-danger-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">還沒有單字，開始新增吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


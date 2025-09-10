import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X, RotateCcw, Volume2, Clock, BookOpen, AlertCircle, Star } from 'lucide-react'
import { getDueVocabularies, getVocabulary, type Vocabulary } from '../api/vocab'
import { submitReview } from '../api/review'

export default function Review() {
  const [searchParams] = useSearchParams()
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const currentVocab = vocabularies[currentIndex]
  const progress = vocabularies.length > 0 ? ((currentIndex + 1) / vocabularies.length) * 100 : 0

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setCompleted(false)
      setShowAnswer(false)
      setCurrentIndex(0)
      setStats({ correct: 0, total: 0 })

      const vocabId = searchParams.get('vocab')
      if (vocabId) {
        const vocab = await getVocabulary(parseInt(vocabId, 10))
        setVocabularies([vocab])
      } else {
        const due = await getDueVocabularies()
        setVocabularies(due)
      }
    } catch (e) {
      console.error('取得複習單字失敗:', e)
      setVocabularies([])
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => { load() }, [load])

  // 鍵盤快捷鍵：Space 顯示答案；← 答錯；→ 答對
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      if (e.repeat) return

      if (!showAnswer && e.code === 'Space') {
        e.preventDefault()
        setShowAnswer(true)
      } else if (showAnswer && !reviewing) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          void handleReview(false)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          void handleReview(true)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showAnswer, reviewing, currentVocab])

  const handleReview = async (isCorrect: boolean) => {
    if (!currentVocab) return
    try {
      setReviewing(true)
      await submitReview({
        vocabulary_id: currentVocab.id,
        is_correct: isCorrect,
        review_type: 'normal',
      })
      setStats(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }))

      if (currentIndex < vocabularies.length - 1) {
        setCurrentIndex(i => i + 1)
        setShowAnswer(false)
      } else {
        setCompleted(true)
      }
    } catch (e) {
      console.error('提交複習結果失敗:', e)
    } finally {
      setReviewing(false)
    }
  }

  const handleRestart = () => { void load() }

  const speak = () => {
    if (!currentVocab) return
    try {
      const u = new SpeechSynthesisUtterance(currentVocab.word)
      u.lang = 'en-US'
      window.speechSynthesis?.speak(u)
    } catch {/* ignore */}
  }

  const getFamiliarityColor = (level: number) => {
    switch (level) {
      case 1: return 'text-danger-600'
      case 2: return 'text-warning-600'
      case 3: return 'text-yellow-500'
      case 4: return 'text-primary-600'
      case 5: return 'text-success-600'
      default: return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">載入複習單字中...</p>
        </div>
      </div>
    )
  }

  if (vocabularies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">太棒了！</h3>
        <p className="text-gray-600 mb-4">目前沒有需要複習的單字</p>
        <button onClick={() => (window.location.href = '/')} className="btn-primary">回到儀表板</button>
      </div>
    )
  }

  if (completed) {
    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="card p-6">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">複習完成！</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center"><span className="text-gray-600">總題數</span><span className="font-semibold">{stats.total}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-600">答對數</span><span className="font-semibold text-success-600">{stats.correct}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-600">答對率</span><span className="font-semibold text-primary-600">{accuracy}%</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRestart} className="btn-secondary flex-1"><RotateCcw className="w-4 h-4 mr-2" />重新複習</button>
            <button onClick={() => (window.location.href = '/')} className="btn-primary flex-1">回到儀表板</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 進度條 */}
      <div className="mb-8" aria-label="複習進度" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={vocabularies.length}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">進度</span>
          <span className="text-sm text-gray-500">{currentIndex + 1} / {vocabularies.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 單字卡片 */}
      <div className="card p-6">
        <div className="text-center">
          {/* 單字 */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentVocab.word}</h1>
            {(currentVocab.ipa || true) && (
              <div className="flex items-center justify-center gap-2">
                {currentVocab.ipa && <span className="text-lg text-gray-600">/{currentVocab.ipa}/</span>}
                <button className="text-gray-400 hover:text-gray-600" onClick={speak} aria-label="播放發音">
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            )}
            {currentVocab.pos && (
              <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full mt-2">
                {currentVocab.pos}
              </span>
            )}
          </div>

          {/* 答案區域 */}
          {showAnswer ? (
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-xl font-medium text-gray-900 mb-2">{currentVocab.zh_meaning}</p>
                {currentVocab.examples && <p className="text-gray-600 italic">"{currentVocab.examples}"</p>}
                {currentVocab.notes && <p className="text-sm text-gray-500 mt-2">{currentVocab.notes}</p>}
                <div className="mt-3 flex items-center justify-end gap-2 text-sm text-gray-500">
                  <Star className={`w-4 h-4 ${getFamiliarityColor(currentVocab.familiarity)}`} />
                  {currentVocab.is_hard && <AlertCircle className="w-4 h-4 text-danger-500" />}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => void handleReview(false)} disabled={reviewing} className="btn-danger flex-1">
                  <X className="w-4 h-4 mr-2" />答錯了
                </button>
                <button onClick={() => void handleReview(true)} disabled={reviewing} className="btn-success flex-1">
                  <Check className="w-4 h-4 mr-2" />答對了
                </button>
              </div>
              <p className="text-xs text-gray-500">小撇步：鍵盤 ←（答錯）、→（答對）</p>
            </div>
          ) : (
            <div className="mb-8">
              <button onClick={() => setShowAnswer(true)} className="btn-primary">顯示答案</button>
              <p className="text-xs text-gray-500 mt-2">小撇步：按空白鍵顯示答案</p>
            </div>
          )}

          {/* 統計 */}
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>答對: {stats.correct}</span>
            <span>總數: {stats.total}</span>
            <span>答對率: {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}


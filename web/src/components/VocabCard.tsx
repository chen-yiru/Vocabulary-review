import { useState } from 'react'
import { Vocabulary } from '../api/vocab'
import { 
  Edit, 
  Trash2, 
  Star, 
  Clock, 
  Tag as TagIcon,
  Volume2,
  Eye,
  EyeOff
} from 'lucide-react'

interface VocabCardProps {
  vocabulary: Vocabulary
  onEdit: (vocabulary: Vocabulary) => void
  onDelete: (id: number) => void
  onReview: (vocabulary: Vocabulary) => void
}

const VocabCard = ({ vocabulary, onEdit, onDelete, onReview }: VocabCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false)

  const getFamiliarityColor = (level: number) => {
    switch (level) {
      case 1: return 'text-red-500'
      case 2: return 'text-orange-500'
      case 3: return 'text-yellow-500'
      case 4: return 'text-blue-500'
      case 5: return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getFamiliarityText = (level: number) => {
    switch (level) {
      case 1: return '不熟悉'
      case 2: return '略懂'
      case 3: return '普通'
      case 4: return '熟悉'
      case 5: return '精通'
      default: return '未知'
    }
  }

  const isDue = () => {
    if (!vocabulary.next_review_at) return true
    const today = new Date()
    const dueDate = new Date(vocabulary.next_review_at)
    return today >= dueDate
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {vocabulary.word}
            </h3>
            {vocabulary.ipa && (
              <span className="text-sm text-gray-500">
                /{vocabulary.ipa}/
              </span>
            )}
            {vocabulary.ipa && (
              <button className="text-gray-400 hover:text-gray-600">
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {vocabulary.pos && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
              {vocabulary.pos}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title={showAnswer ? '隱藏答案' : '顯示答案'}
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(vocabulary)}
            className="p-1 text-gray-400 hover:text-primary-600"
            title="編輯"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(vocabulary.id)}
            className="p-1 text-gray-400 hover:text-danger-600"
            title="刪除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAnswer && (
        <div className="mb-4 space-y-3">
          <div>
            <p className="text-gray-700 font-medium">
              {vocabulary.zh_meaning}
            </p>
          </div>

          {vocabulary.examples && (
            <div>
              <p className="text-sm text-gray-600 italic">
                "{vocabulary.examples}"
              </p>
            </div>
          )}

          {vocabulary.notes && (
            <div>
              <p className="text-sm text-gray-500">
                {vocabulary.notes}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${getFamiliarityColor(vocabulary.familiarity)}`} />
            <span className={`text-sm font-medium ${getFamiliarityColor(vocabulary.familiarity)}`}>
              {getFamiliarityText(vocabulary.familiarity)}
            </span>
          </div>

          {vocabulary.is_hard && (
            <span className="badge-danger">
              困難
            </span>
          )}

          {isDue() && (
            <span className="badge-warning">
              待複習
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {vocabulary.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <TagIcon className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {vocabulary.tags.length}
              </span>
            </div>
          )}

          {vocabulary.next_review_at && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                {isDue() ? '已到期' : formatDate(vocabulary.next_review_at)}
              </span>
            </div>
          )}
        </div>
      </div>

      {vocabulary.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {vocabulary.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onReview(vocabulary)}
          className="btn-primary flex-1"
        >
          開始複習
        </button>
      </div>
    </div>
  )
}

export default VocabCard


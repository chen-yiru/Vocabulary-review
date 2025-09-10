import { useState, useEffect } from 'react'
import { X, Search, Filter } from 'lucide-react'
import { useFilterStore } from '../store/filters'
import { getTags, Tag } from '../api/tags'

interface FiltersPanelProps {
  onClose: () => void
}

const FiltersPanel = ({ onClose }: FiltersPanelProps) => {
  const { filters, setFilters, resetFilters } = useFilterStore()
  const [tags, setTags] = useState<Tag[]>([])
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getTags()
        setTags(tagsData)
      } catch (error) {
        console.error('取得標籤失敗:', error)
      }
    }

    fetchTags()
  }, [])

  const handleApply = () => {
    setFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    resetFilters()
    setLocalFilters({
      search: '',
      letter: '',
      tag_ids: [],
      is_hard: undefined,
      familiarity_min: undefined,
      familiarity_max: undefined,
      created_after: '',
      created_before: '',
      last_review_after: '',
      last_review_before: '',
      due_after: '',
      due_before: '',
    })
  }

  const handleTagToggle = (tagId: number) => {
    const currentIds = localFilters.tag_ids || []
    if (currentIds.includes(tagId)) {
      setLocalFilters(prev => ({
        ...prev,
        tag_ids: currentIds.filter(id => id !== tagId)
      }))
    } else {
      setLocalFilters(prev => ({
        ...prev,
        tag_ids: [...currentIds, tagId]
      }))
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">篩選條件</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* 搜尋 */}
        <div>
          <label className="label">搜尋</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={localFilters.search || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
              className="input pl-10"
              placeholder="搜尋單字或中文意思"
            />
          </div>
        </div>

        {/* 字母篩選 */}
        <div>
          <label className="label">字母開頭</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocalFilters(prev => ({ ...prev, letter: '' }))}
              className={`px-3 py-1 text-sm rounded-full border ${
                !localFilters.letter
                  ? 'bg-primary-100 text-primary-700 border-primary-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setLocalFilters(prev => ({ ...prev, letter }))}
                className={`px-3 py-1 text-sm rounded-full border ${
                  localFilters.letter === letter
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* 標籤篩選 */}
        <div>
          <label className="label">標籤</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  localFilters.tag_ids?.includes(tag.id)
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* 困難程度 */}
        <div>
          <label className="label">困難程度</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="is_hard"
                checked={localFilters.is_hard === undefined}
                onChange={() => setLocalFilters(prev => ({ ...prev, is_hard: undefined }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">全部</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="is_hard"
                checked={localFilters.is_hard === true}
                onChange={() => setLocalFilters(prev => ({ ...prev, is_hard: true }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">困難單字</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="is_hard"
                checked={localFilters.is_hard === false}
                onChange={() => setLocalFilters(prev => ({ ...prev, is_hard: false }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">一般單字</span>
            </label>
          </div>
        </div>

        {/* 熟悉度範圍 */}
        <div>
          <label className="label">熟悉度範圍</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">最小值</label>
              <select
                value={localFilters.familiarity_min || ''}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  familiarity_min: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="input"
              >
                <option value="">不限</option>
                <option value="1">1 - 不熟悉</option>
                <option value="2">2 - 略懂</option>
                <option value="3">3 - 普通</option>
                <option value="4">4 - 熟悉</option>
                <option value="5">5 - 精通</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">最大值</label>
              <select
                value={localFilters.familiarity_max || ''}
                onChange={(e) => setLocalFilters(prev => ({ 
                  ...prev, 
                  familiarity_max: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                className="input"
              >
                <option value="">不限</option>
                <option value="1">1 - 不熟悉</option>
                <option value="2">2 - 略懂</option>
                <option value="3">3 - 普通</option>
                <option value="4">4 - 熟悉</option>
                <option value="5">5 - 精通</option>
              </select>
            </div>
          </div>
        </div>

        {/* 日期篩選 */}
        <div>
          <label className="label">建立日期</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">開始日期</label>
              <input
                type="date"
                value={localFilters.created_after || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, created_after: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">結束日期</label>
              <input
                type="date"
                value={localFilters.created_before || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, created_before: e.target.value }))}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 複習日期篩選 */}
        <div>
          <label className="label">複習日期</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">開始日期</label>
              <input
                type="date"
                value={localFilters.last_review_after || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, last_review_after: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">結束日期</label>
              <input
                type="date"
                value={localFilters.last_review_before || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, last_review_before: e.target.value }))}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* 到期日期篩選 */}
        <div>
          <label className="label">到期日期</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">開始日期</label>
              <input
                type="date"
                value={localFilters.due_after || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, due_after: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">結束日期</label>
              <input
                type="date"
                value={localFilters.due_before || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, due_before: e.target.value }))}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="btn-secondary"
        >
          重置
        </button>
        <button
          onClick={handleApply}
          className="btn-primary"
        >
          套用篩選
        </button>
      </div>
    </div>
  )
}

export default FiltersPanel


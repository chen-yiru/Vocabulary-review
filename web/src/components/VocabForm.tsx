import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus } from 'lucide-react'
import { Vocabulary, createVocabulary, updateVocabulary, getTags, Tag } from '../api/vocab'

const vocabSchema = z.object({
  word: z.string().min(1, '請輸入單字'),
  zh_meaning: z.string().min(1, '請輸入中文意思'),
  pos: z.string().optional(),
  notes: z.string().optional(),
  examples: z.string().optional(),
  ipa: z.string().optional(),
  familiarity: z.number().min(1).max(5),
  is_hard: z.boolean(),
  tag_ids: z.array(z.number()),
})

type VocabForm = z.infer<typeof vocabSchema>

interface VocabFormProps {
  vocabulary?: Vocabulary | null
  onClose: () => void
}

const VocabForm = ({ vocabulary, onClose }: VocabFormProps) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [showNewTag, setShowNewTag] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VocabForm>({
    resolver: zodResolver(vocabSchema),
    defaultValues: {
      word: vocabulary?.word || '',
      zh_meaning: vocabulary?.zh_meaning || '',
      pos: vocabulary?.pos || '',
      notes: vocabulary?.notes || '',
      examples: vocabulary?.examples || '',
      ipa: vocabulary?.ipa || '',
      familiarity: vocabulary?.familiarity || 1,
      is_hard: vocabulary?.is_hard || false,
      tag_ids: vocabulary?.tags?.map(tag => tag.id) || [],
    }
  })

  const selectedTagIds = watch('tag_ids')

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

  const onSubmit = async (data: VocabForm) => {
    try {
      setLoading(true)
      
      if (vocabulary) {
        await updateVocabulary(vocabulary.id, data)
      } else {
        await createVocabulary(data)
      }
      
      onClose()
    } catch (error) {
      console.error('儲存單字失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagToggle = (tagId: number) => {
    const currentIds = selectedTagIds || []
    if (currentIds.includes(tagId)) {
      setValue('tag_ids', currentIds.filter(id => id !== tagId))
    } else {
      setValue('tag_ids', [...currentIds, tagId])
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      // 這裡應該調用創建標籤的 API
      // 暫時先添加到本地狀態
      const newTag: Tag = {
        id: Date.now(), // 臨時 ID
        name: newTagName.trim(),
        created_at: new Date().toISOString(),
      }
      setTags(prev => [...prev, newTag])
      setNewTagName('')
      setShowNewTag(false)
    } catch (error) {
      console.error('創建標籤失敗:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {vocabulary ? '編輯單字' : '新增單字'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="word" className="label">
                單字 *
              </label>
              <input
                {...register('word')}
                type="text"
                className={errors.word ? 'input-error' : 'input'}
                placeholder="請輸入英文單字"
              />
              {errors.word && (
                <p className="error-message">{errors.word.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="zh_meaning" className="label">
                中文意思 *
              </label>
              <input
                {...register('zh_meaning')}
                type="text"
                className={errors.zh_meaning ? 'input-error' : 'input'}
                placeholder="請輸入中文意思"
              />
              {errors.zh_meaning && (
                <p className="error-message">{errors.zh_meaning.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pos" className="label">
                詞性
              </label>
              <select {...register('pos')} className="input">
                <option value="">選擇詞性</option>
                <option value="noun">名詞 (n.)</option>
                <option value="verb">動詞 (v.)</option>
                <option value="adjective">形容詞 (adj.)</option>
                <option value="adverb">副詞 (adv.)</option>
                <option value="preposition">介詞 (prep.)</option>
                <option value="conjunction">連接詞 (conj.)</option>
                <option value="interjection">感嘆詞 (interj.)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ipa" className="label">
                音標
              </label>
              <input
                {...register('ipa')}
                type="text"
                className="input"
                placeholder="例如: /həˈloʊ/"
              />
            </div>
          </div>

          <div>
            <label htmlFor="examples" className="label">
              例句
            </label>
            <textarea
              {...register('examples')}
              rows={3}
              className="input"
              placeholder="請輸入例句"
            />
          </div>

          <div>
            <label htmlFor="notes" className="label">
              筆記
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input"
              placeholder="請輸入筆記或補充說明"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="familiarity" className="label">
                熟悉度
              </label>
              <select {...register('familiarity', { valueAsNumber: true })} className="input">
                <option value={1}>1 - 不熟悉</option>
                <option value={2}>2 - 略懂</option>
                <option value={3}>3 - 普通</option>
                <option value={4}>4 - 熟悉</option>
                <option value={5}>5 - 精通</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                {...register('is_hard')}
                type="checkbox"
                id="is_hard"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_hard" className="ml-2 block text-sm text-gray-900">
                標記為困難單字
              </label>
            </div>
          </div>

          <div>
            <label className="label">標籤</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTagIds?.includes(tag.id)
                        ? 'bg-primary-100 text-primary-700 border-primary-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              {showNewTag ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="input flex-1"
                    placeholder="新標籤名稱"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                  />
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTag(false)
                      setNewTagName('')
                    }}
                    className="btn-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewTag(true)}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增標籤
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VocabForm


import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download, Upload } from 'lucide-react'
import { getVocabularies, deleteVocabulary, Vocabulary } from '../api/vocab'
import { useFilterStore } from '../store/filters'
import VocabCard from '../components/VocabCard'
import VocabForm from '../components/VocabForm'
import FiltersPanel from '../components/FiltersPanel'
import ImportExport from '../components/ImportExport'

const VocabList = () => {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null)
  
  const { filters, page, size, setPage } = useFilterStore()

  useEffect(() => {
    fetchVocabularies()
  }, [filters, page, size])

  const fetchVocabularies = async () => {
    try {
      setLoading(true)
      const response = await getVocabularies(filters, { page, size })
      setVocabularies(response.items)
      setTotal(response.total)
    } catch (error) {
      console.error('取得單字列表失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (vocabulary: Vocabulary) => {
    setEditingVocab(vocabulary)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('確定要刪除這個單字嗎？')) {
      try {
        await deleteVocabulary(id)
        fetchVocabularies()
      } catch (error) {
        console.error('刪除單字失敗:', error)
      }
    }
  }

  const handleReview = (vocabulary: Vocabulary) => {
    // 導向複習頁面
    window.location.href = `/review?vocab=${vocabulary.id}`
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingVocab(null)
    fetchVocabularies()
  }

  const totalPages = Math.ceil(total / size)

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作按鈕 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">單字列表</h1>
          <p className="text-gray-600">
            共 {total} 個單字
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            篩選
          </button>
          
          <button
            onClick={() => setShowImportExport(true)}
            className="btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            匯入/匯出
          </button>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增單字
          </button>
        </div>
      </div>

      {/* 篩選面板 */}
      {showFilters && (
        <FiltersPanel onClose={() => setShowFilters(false)} />
      )}

      {/* 載入中 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </div>
        </div>
      )}

      {/* 單字列表 */}
      {!loading && (
        <>
          {vocabularies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vocabularies.map((vocab) => (
                <VocabCard
                  key={vocab.id}
                  vocabulary={vocab}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReview={handleReview}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                沒有找到單字
              </h3>
              <p className="text-gray-600 mb-4">
                嘗試調整篩選條件或新增一些單字
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                新增第一個單字
              </button>
            </div>
          )}

          {/* 分頁 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                上一頁
              </button>
              
              <span className="text-sm text-gray-600">
                第 {page} 頁，共 {totalPages} 頁
              </span>
              
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                下一頁
              </button>
            </div>
          )}
        </>
      )}

      {/* 單字表單 */}
      {showForm && (
        <VocabForm
          vocabulary={editingVocab}
          onClose={handleFormClose}
        />
      )}

      {/* 匯入匯出 */}
      {showImportExport && (
        <ImportExport
          onClose={() => setShowImportExport(false)}
          onImport={fetchVocabularies}
        />
      )}
    </div>
  )
}

export default VocabList


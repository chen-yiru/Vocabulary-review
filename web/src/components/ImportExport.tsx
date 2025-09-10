import { useState, useRef } from 'react'
import { X, Upload, Download, FileText, File } from 'lucide-react'
import { importVocabularies, exportVocabularies, downloadFile } from '../api/import_export'
import { useFilterStore } from '../store/filters'

interface ImportExportProps {
  onClose: () => void
  onImport: () => void
}

const ImportExport = ({ onClose, onImport }: ImportExportProps) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [loading, setLoading] = useState(false)
  const [importData, setImportData] = useState('')
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv')
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv')
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { filters } = useFilterStore()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setResult({ type: 'error', message: '請選擇檔案或輸入資料' })
      return
    }

    try {
      setLoading(true)
      setResult(null)
      
      const response = await importVocabularies({
        data: importData,
        format: importFormat
      })
      
      setResult({
        type: 'success',
        message: `匯入完成！成功匯入 ${response.imported_count} 個單字，跳過 ${response.skipped_count} 個重複單字。`
      })
      
      setImportData('')
      onImport()
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.response?.data?.detail || '匯入失敗'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      setResult(null)
      
      const blob = await exportVocabularies({
        format: exportFormat,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
      
      const filename = `vocabularies.${exportFormat}`
      downloadFile(blob, filename)
      
      setResult({
        type: 'success',
        message: '匯出完成！檔案已下載。'
      })
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.response?.data?.detail || '匯出失敗'
      })
    } finally {
      setLoading(false)
    }
  }

  const csvExample = `word,zh,pos,notes,examples,ipa,tags
hello,你好,interjection,常用問候語,"Hello, how are you?",/həˈloʊ/,問候
world,世界,noun,地球或宇宙,"The world is beautiful.",/wɜːrld/,名詞`

  const jsonExample = `[
  {
    "word": "hello",
    "zh_meaning": "你好",
    "pos": "interjection",
    "notes": "常用問候語",
    "examples": "Hello, how are you?",
    "ipa": "/həˈloʊ/",
    "familiarity": 1,
    "is_hard": false,
    "tags": [
      {
        "name": "問候",
        "color": "#3b82f6"
      }
    ]
  }
]`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">匯入/匯出</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* 標籤頁 */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'import'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4 mr-2 inline" />
              匯入
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'export'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Download className="w-4 h-4 mr-2 inline" />
              匯出
            </button>
          </div>

          {/* 結果訊息 */}
          {result && (
            <div className={`mb-6 p-4 rounded-lg ${
              result.type === 'success' 
                ? 'bg-success-50 border border-success-200' 
                : 'bg-danger-50 border border-danger-200'
            }`}>
              <p className={`text-sm ${
                result.type === 'success' ? 'text-success-600' : 'text-danger-600'
              }`}>
                {result.message}
              </p>
            </div>
          )}

          {/* 匯入頁面 */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">匯入單字資料</h3>
                <p className="text-sm text-gray-600 mb-4">
                  支援 CSV 和 JSON 格式。請確保資料格式正確。
                </p>
              </div>

              {/* 檔案選擇 */}
              <div>
                <label className="label">選擇檔案</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileSelect}
                  className="input"
                />
              </div>

              {/* 格式選擇 */}
              <div>
                <label className="label">資料格式</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={importFormat === 'csv'}
                      onChange={(e) => setImportFormat(e.target.value as 'csv')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">CSV</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="json"
                      checked={importFormat === 'json'}
                      onChange={(e) => setImportFormat(e.target.value as 'json')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">JSON</span>
                  </label>
                </div>
              </div>

              {/* 資料輸入 */}
              <div>
                <label className="label">或直接貼上資料</label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                  className="input font-mono text-sm"
                  placeholder={importFormat === 'csv' ? csvExample : jsonExample}
                />
              </div>

              {/* 格式說明 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">格式說明</h4>
                {importFormat === 'csv' ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">CSV 格式欄位：</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• <code>word</code> - 英文單字（必填）</li>
                      <li>• <code>zh</code> - 中文意思（必填）</li>
                      <li>• <code>pos</code> - 詞性（可選）</li>
                      <li>• <code>notes</code> - 筆記（可選）</li>
                      <li>• <code>examples</code> - 例句（可選）</li>
                      <li>• <code>ipa</code> - 音標（可選）</li>
                      <li>• <code>tags</code> - 標籤，用逗號分隔（可選）</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">JSON 格式包含完整單字資料，支援標籤顏色等進階功能。</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleImport}
                disabled={loading || !importData.trim()}
                className="btn-primary w-full"
              >
                {loading ? '匯入中...' : '開始匯入'}
              </button>
            </div>
          )}

          {/* 匯出頁面 */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">匯出單字資料</h3>
                <p className="text-sm text-gray-600 mb-4">
                  將您的單字資料匯出為檔案，方便備份或分享。
                </p>
              </div>

              {/* 格式選擇 */}
              <div>
                <label className="label">匯出格式</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value as 'csv')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">CSV</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={(e) => setExportFormat(e.target.value as 'json')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">JSON</span>
                  </label>
                </div>
              </div>

              {/* 篩選說明 */}
              {Object.keys(filters).length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">篩選條件</h4>
                  <p className="text-sm text-blue-700">
                    將根據目前的篩選條件匯出單字。如需匯出全部單字，請先清除篩選條件。
                  </p>
                </div>
              )}

              <button
                onClick={handleExport}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? '匯出中...' : '開始匯出'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportExport


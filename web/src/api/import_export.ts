import apiClient from './client'
import { VocabularyFilters } from './vocab'

// 匯入匯出相關 API

export interface ImportRequest {
  data: string
  format: 'csv' | 'json'
}

export interface ExportRequest {
  format: 'csv' | 'json'
  filters?: VocabularyFilters
}

export interface ImportResponse {
  message: string
  imported_count: number
  skipped_count: number
}

// 匯入單字資料
export const importVocabularies = async (data: ImportRequest): Promise<ImportResponse> => {
  const response = await apiClient.post('/import-export/import', data)
  return response.data
}

// 匯出單字資料
export const exportVocabularies = async (data: ExportRequest): Promise<Blob> => {
  const response = await apiClient.post('/import-export/export', data, {
    responseType: 'blob'
  })
  return response.data
}

// 下載檔案
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}


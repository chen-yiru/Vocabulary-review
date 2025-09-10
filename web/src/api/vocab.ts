import apiClient from './client'

// 單字相關 API

export interface Vocabulary {
  id: number
  word: string
  zh_meaning: string
  pos?: string
  notes?: string
  examples?: string
  ipa?: string
  familiarity: number
  is_hard: boolean
  next_review_at?: string
  created_at: string
  updated_at: string
  last_reviewed_at?: string
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
  color?: string
  description?: string
  created_at: string
}

export interface VocabularyCreateRequest {
  word: string
  zh_meaning: string
  pos?: string
  notes?: string
  examples?: string
  ipa?: string
  familiarity?: number
  is_hard?: boolean
  tag_ids?: number[]
}

export interface VocabularyUpdateRequest {
  word?: string
  zh_meaning?: string
  pos?: string
  notes?: string
  examples?: string
  ipa?: string
  familiarity?: number
  is_hard?: boolean
  tag_ids?: number[]
}

export interface VocabularyFilters {
  search?: string
  letter?: string
  tag_ids?: number[]
  is_hard?: boolean
  familiarity_min?: number
  familiarity_max?: number
  created_after?: string
  created_before?: string
  last_review_after?: string
  last_review_before?: string
  due_after?: string
  due_before?: string
}

export interface PaginationParams {
  page?: number
  size?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// 建立單字
export const createVocabulary = async (data: VocabularyCreateRequest): Promise<Vocabulary> => {
  const response = await apiClient.post('/vocab/', data)
  return response.data
}

// 取得單字列表
export const getVocabularies = async (
  filters?: VocabularyFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<Vocabulary>> => {
  const params = new URLSearchParams()

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()))
        } else {
          params.append(key, value.toString())
        }
      }
    })
  }

  if (pagination) {
    if (pagination.page) params.append('page', pagination.page.toString())
    if (pagination.size) params.append('size', pagination.size.toString())
  }

  const response = await apiClient.get(`/vocab/?${params.toString()}`)
  return response.data
}

// 取得特定單字
export const getVocabulary = async (id: number): Promise<Vocabulary> => {
  const response = await apiClient.get(`/vocab/${id}`)
  return response.data
}

// 更新單字
export const updateVocabulary = async (
  id: number,
  data: VocabularyUpdateRequest
): Promise<Vocabulary> => {
  const response = await apiClient.put(`/vocab/${id}`, data)
  return response.data
}

// 刪除單字
export const deleteVocabulary = async (id: number): Promise<void> => {
  await apiClient.delete(`/vocab/${id}`)
}

// 取得需要複習的單字
export const getDueVocabularies = async (): Promise<Vocabulary[]> => {
  const response = await apiClient.get('/vocab/due/review')
  return response.data
}

/** ===== 新增：標籤 API（供 VocabForm 匯入使用） ===== */

// 取得所有標籤（修正 Vite 匯入錯誤：No matching export for getTags）
export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get('/tags')
  return response.data
}


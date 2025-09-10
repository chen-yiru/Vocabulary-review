import apiClient from './client'

// 複習相關 API

export interface ReviewRequest {
  vocabulary_id: number
  is_correct: boolean
  response_time?: number
  review_type?: string
}

export interface ReviewLog {
  id: number
  vocabulary_id: number
  is_correct: boolean
  response_time?: number
  review_type: string
  created_at: string
}

export interface ReviewStats {
  total_reviews: number
  correct_reviews: number
  accuracy_rate: number
  today_reviews: number
  due_vocabularies: number
  hard_vocabularies: number
  total_vocabularies: number
}

// 提交複習結果
export const submitReview = async (data: ReviewRequest): Promise<ReviewLog> => {
  const response = await apiClient.post('/review/', data)
  return response.data
}

// 取得複習記錄
export const getReviewLogs = async (
  vocabulary_id?: number,
  limit?: number
): Promise<ReviewLog[]> => {
  const params = new URLSearchParams()
  
  if (vocabulary_id) {
    params.append('vocabulary_id', vocabulary_id.toString())
  }
  
  if (limit) {
    params.append('limit', limit.toString())
  }
  
  const response = await apiClient.get(`/review/logs?${params.toString()}`)
  return response.data
}

// 取得複習統計
export const getReviewStats = async (): Promise<ReviewStats> => {
  const response = await apiClient.get('/review/stats')
  return response.data
}


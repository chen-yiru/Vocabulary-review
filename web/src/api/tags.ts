import apiClient from './client'

// 標籤相關 API

export interface Tag {
  id: number
  name: string
  color?: string
  description?: string
  created_at: string
}

export interface TagCreateRequest {
  name: string
  color?: string
  description?: string
}

export interface TagUpdateRequest {
  name?: string
  color?: string
  description?: string
}

// 建立標籤
export const createTag = async (data: TagCreateRequest): Promise<Tag> => {
  const response = await apiClient.post('/tags/', data)
  return response.data
}

// 取得所有標籤
export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get('/tags/')
  return response.data
}

// 取得特定標籤
export const getTag = async (id: number): Promise<Tag> => {
  const response = await apiClient.get(`/tags/${id}`)
  return response.data
}

// 更新標籤
export const updateTag = async (id: number, data: TagUpdateRequest): Promise<Tag> => {
  const response = await apiClient.put(`/tags/${id}`, data)
  return response.data
}

// 刪除標籤
export const deleteTag = async (id: number): Promise<void> => {
  await apiClient.delete(`/tags/${id}`)
}


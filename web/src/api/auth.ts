import apiClient from './client'

// 認證相關 API

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  full_name?: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserUpdateRequest {
  username?: string
  email?: string
  full_name?: string
  password?: string
}

// 登入
export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post('/users/login', data)
  return response.data
}

// 註冊
export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post('/users/register', data)
  return response.data
}

// 取得目前使用者資訊
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/users/me')
  return response.data
}

// 更新使用者資訊
export const updateUser = async (data: UserUpdateRequest): Promise<User> => {
  const response = await apiClient.put('/users/me', data)
  return response.data
}

// 刪除使用者帳號
export const deleteUser = async (): Promise<void> => {
  await apiClient.delete('/users/me')
}


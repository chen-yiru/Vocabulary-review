import axios from 'axios'

// 單人模式：不帶 Authorization，僅設定 baseURL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  withCredentials: false,
})

export default apiClient

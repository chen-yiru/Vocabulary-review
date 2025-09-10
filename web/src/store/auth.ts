// src/store/auth.ts
import { create } from 'zustand'
import apiClient from '../api/client'

export type UserInfo = {
  username?: string | null
  email?: string | null
  full_name?: string | null
}

type AuthState = {
  // 狀態
  isAuthenticated: boolean
  singleUserMode: boolean
  isLoading: boolean
  error: string | null
  user: UserInfo | null

  // 動作
  clearError: () => void
  setUser: (u: UserInfo | null) => void
  fetchMe: () => Promise<void>
  updateUser: (patch: Partial<UserInfo> & { password?: string }) => Promise<void>
  deleteUser: () => Promise<void>

  // 為相容保留（單人模式不做事）
  login: (_?: unknown) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>((set, get) => ({
  // 單人模式：預設已登入
  isAuthenticated: true,
  singleUserMode: true,
  isLoading: false,
  error: null,
  user: null,

  clearError: () => set({ error: null }),

  setUser: (u) => set({ user: u }),

  // 嘗試從後端拿使用者；若後端未實作，就給一個 fallback
  fetchMe: async () => {
    try {
      set({ isLoading: true, error: null })
      const res = await apiClient.get('/users/me')
      set({ user: res.data ?? null })
    } catch (e: any) {
      console.info('[auth] /users/me 不可用，使用單人模式預設使用者')
      set({
        user: {
          username: 'single-user',
          email: 'singleuser@local',
          full_name: '單人模式',
        },
      })
    } finally {
      set({ isLoading: false })
    }
  },

  // 更新個資或密碼；若後端未實作則不報錯、僅在 console 提示
  updateUser: async (patch) => {
    try {
      set({ isLoading: true, error: null })
      const res = await apiClient.put('/users/me', patch)
      set({ user: res.data ?? get().user })
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ??
        e?.message ??
        '更新失敗（後端可能未開啟 /users/me）'
      set({ error: msg })
      console.warn('[auth] updateUser:', msg)
    } finally {
      set({ isLoading: false })
    }
  },

  // 刪除帳號（單人模式通常不允許，這裡做安全處理）
  deleteUser: async () => {
    try {
      set({ isLoading: true, error: null })
      await apiClient.delete('/users/me')
      // 單人模式不真正登出，只清空資訊
      set({ user: null })
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ??
        e?.message ??
        '刪除失敗（單人模式通常停用此功能）'
      set({ error: msg })
      console.warn('[auth] deleteUser:', msg)
    } finally {
      set({ isLoading: false })
    }
  },

  // 相容舊介面：單人模式下不需要登入/登出
  login: async () => {},
  logout: () => {},
}))

// 舊程式相容別名（若某些檔還在 import { useAuthStore }）
export const useAuthStore = useAuth

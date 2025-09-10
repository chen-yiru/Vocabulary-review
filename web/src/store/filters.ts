import { create } from 'zustand'
import { VocabularyFilters } from '../api/vocab'

interface FilterState {
  // 篩選條件
  filters: VocabularyFilters
  
  // 分頁
  page: number
  size: number
  
  // 排序
  sortBy: string
  sortOrder: 'asc' | 'desc'
  
  // 動作
  setFilters: (filters: Partial<VocabularyFilters>) => void
  resetFilters: () => void
  setPage: (page: number) => void
  setSize: (size: number) => void
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}

const defaultFilters: VocabularyFilters = {
  search: '',
  letter: '',
  tag_ids: [],
  is_hard: undefined,
  familiarity_min: undefined,
  familiarity_max: undefined,
  created_after: '',
  created_before: '',
  last_review_after: '',
  last_review_before: '',
  due_after: '',
  due_before: '',
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // 初始狀態
  filters: defaultFilters,
  page: 1,
  size: 20,
  sortBy: 'created_at',
  sortOrder: 'desc',

  // 設定篩選條件
  setFilters: (newFilters: Partial<VocabularyFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // 重置到第一頁
    }))
  },

  // 重置篩選條件
  resetFilters: () => {
    set({
      filters: defaultFilters,
      page: 1,
    })
  },

  // 設定頁碼
  setPage: (page: number) => {
    set({ page })
  },

  // 設定每頁大小
  setSize: (size: number) => {
    set({ size, page: 1 }) // 重置到第一頁
  },

  // 設定排序
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => {
    set({ sortBy, sortOrder })
  },
}))

// 選擇器函數
export const useFilters = () => useFilterStore((state) => state.filters)
export const usePagination = () => useFilterStore((state) => ({
  page: state.page,
  size: state.size,
}))
export const useSorting = () => useFilterStore((state) => ({
  sortBy: state.sortBy,
  sortOrder: state.sortOrder,
}))


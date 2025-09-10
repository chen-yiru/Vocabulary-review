import { describe, it, expect } from 'vitest'
import { useFilterStore } from '../store/filters'

describe('Filter Store', () => {
  it('should initialize with default filters', () => {
    const store = useFilterStore.getState()
    
    expect(store.filters.search).toBe('')
    expect(store.filters.letter).toBe('')
    expect(store.filters.tag_ids).toEqual([])
    expect(store.filters.is_hard).toBeUndefined()
    expect(store.page).toBe(1)
    expect(store.size).toBe(20)
  })

  it('should update filters correctly', () => {
    const { setFilters } = useFilterStore.getState()
    
    setFilters({ search: 'test', is_hard: true })
    
    const store = useFilterStore.getState()
    expect(store.filters.search).toBe('test')
    expect(store.filters.is_hard).toBe(true)
    expect(store.page).toBe(1) // Should reset to page 1
  })

  it('should reset filters correctly', () => {
    const { setFilters, resetFilters } = useFilterStore.getState()
    
    // Set some filters first
    setFilters({ search: 'test', is_hard: true })
    
    // Reset filters
    resetFilters()
    
    const store = useFilterStore.getState()
    expect(store.filters.search).toBe('')
    expect(store.filters.is_hard).toBeUndefined()
    expect(store.page).toBe(1)
  })

  it('should update page correctly', () => {
    const { setPage } = useFilterStore.getState()
    
    setPage(3)
    
    const store = useFilterStore.getState()
    expect(store.page).toBe(3)
  })

  it('should update size and reset page', () => {
    const { setSize, setPage } = useFilterStore.getState()
    
    setPage(5)
    setSize(50)
    
    const store = useFilterStore.getState()
    expect(store.size).toBe(50)
    expect(store.page).toBe(1) // Should reset to page 1
  })
})


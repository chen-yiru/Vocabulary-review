// src/components/Layout.tsx
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X, BookOpen, List, RotateCcw, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../store/auth'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean        // 👈 讓 end 變成可選屬性
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { singleUserMode } = useAuth()

  const nav: Readonly<NavItem[]> = [
    { to: '/',      label: '儀表板',  icon: BookOpen, end: true },
    { to: '/vocab', label: '單字列表', icon: List },
    { to: '/review',label: '複習',     icon: RotateCcw },
    { to: '/settings', label: '設定',  icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部 Header */}
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* 左：漢堡 + 標題 */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="開啟選單"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <span className="text-lg font-bold">背單字 App</span>
          </div>

          {/* 中：桌機導覽 */}
          <nav className="hidden md:flex items-center gap-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}  // 👈 現在是可選屬性，不會報錯
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* 右：狀態 */}
          <div className="hidden md:flex items-center text-xs text-gray-600">
            <span className="px-2 py-1 rounded bg-gray-100">
              {singleUserMode ? '單人模式' : '多使用者'}
            </span>
          </div>
        </div>

        {/* 手機抽屜選單 */}
        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} />
            <div className="fixed top-0 left-0 right-0 z-50 bg-white md:hidden shadow-lg">
              <div className="h-16 px-4 flex items-center justify-between border-b">
                <span className="text-lg font-bold">背單字 App</span>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="關閉選單"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="px-2 py-2">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-base ${
                        isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                ))}

                <div className="px-3 py-3 text-xs text-gray-600">
                  {singleUserMode ? '單人模式' : '多使用者'}
                </div>
              </nav>
            </div>
          </>
        )}
      </header>

      {/* 內容區 */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

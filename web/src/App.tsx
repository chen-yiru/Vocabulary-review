import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import AuthGate from './components/AuthGate.tsx'
import Dashboard from './pages/Dashboard.tsx'
import VocabList from './pages/VocabList.tsx'
import Review from './pages/Review.tsx'
import Settings from './pages/Settings.tsx'


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthGate>
        <Routes>
          {/* 根路由用 Layout 包住，子頁面透過 <Outlet /> 渲染 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="vocab" element={<VocabList />} />
            <Route path="review" element={<Review />} />
            <Route path="settings" element={<Settings />} />
            {/* 兜底：任何未知路徑導回首頁 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthGate>
    </div>
  )
}

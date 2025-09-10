# 背單字 App 前端

React + Vite + TypeScript 前端應用程式，提供現代化的使用者介面和完整的 PWA 功能。

## 🚀 功能特色

- **現代化 UI**：使用 Tailwind CSS 設計的響應式介面
- **PWA 支援**：離線可用、可安裝到桌面
- **狀態管理**：使用 Zustand（單人模式免登入）
- **表單驗證**：react-hook-form + zod 驗證
- **TypeScript**：完整的型別安全
- **無障礙設計**：支援鍵盤操作和螢幕閱讀器

## 📋 需求

- Node.js 18+
- npm 或 yarn

## 🛠️ 安裝與設定

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數設定

複製環境變數範例檔案：

```bash
cp env.example .env
```

編輯 `.env` 檔案：

```env
# API 基礎 URL
VITE_API_BASE_URL=http://localhost:8000

# 應用程式設定
VITE_APP_NAME=背單字 App
VITE_APP_VERSION=1.0.0

# 除錯模式
VITE_DEBUG=false
```

## 🚀 開發

### 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動。

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 🧪 測試

### 執行測試

```bash
npm test
```

### 測試覆蓋率

```bash
npm run test:coverage
```

### 測試 UI

```bash
npm run test:ui
```

## 🔧 程式碼品質

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npx prettier --write src/
```

## 📱 PWA 功能

### 離線支援

應用程式支援離線使用，當網路連線恢復時會自動同步資料。

### 安裝到桌面

在支援的瀏覽器中，可以將應用程式安裝到桌面或主畫面。

### Service Worker

自動快取靜態資源和 API 回應，提供更好的效能。

## 🎨 UI 組件

### 設計系統

使用 Tailwind CSS 建立一致的設計系統：

- **顏色**：主要色調、成功、警告、危險
- **間距**：統一的間距系統
- **字體**：Inter 字體家族
- **動畫**：流暢的過渡動畫

### 組件結構

```
src/components/
├── Layout.tsx          # 主要佈局
├── AuthGate.tsx        # 認證守衛
├── VocabCard.tsx       # 單字卡片
├── VocabForm.tsx       # 單字表單
├── FiltersPanel.tsx    # 篩選面板
├── ImportExport.tsx    # 匯入匯出
└── ...
```

## 📄 頁面結構

```
src/pages/
├── Login.tsx           # 登入頁面
├── Register.tsx        # 註冊頁面
├── Dashboard.tsx       # 儀表板
├── VocabList.tsx       # 單字列表
├── Review.tsx          # 複習頁面
└── Settings.tsx        # 設定頁面
```

## 🔄 狀態管理

使用 Zustand 進行狀態管理：

### 認證狀態

```typescript
const { user, isAuthenticated, login, logout } = useAuthStore()
```

### 篩選狀態

```typescript
const { filters, setFilters, resetFilters } = useFilterStore()
```

## 🌐 API 整合

### API 客戶端

使用 axios 建立統一的 API 客戶端：

- 自動添加認證 token
- 統一錯誤處理
- 請求/回應攔截器

### API 模組

```
src/api/
├── client.ts           # API 客戶端
├── auth.ts            # 認證 API
├── vocab.ts           # 單字 API
├── tags.ts            # 標籤 API
├── review.ts          # 複習 API
└── import_export.ts   # 匯入匯出 API
```

## 🚀 部署

### Vercel

1. 連接 GitHub 倉庫到 Vercel
2. 設定環境變數：
   - `VITE_API_BASE_URL`: 後端 API URL
3. 自動部署

### Netlify

1. 連接 GitHub 倉庫到 Netlify
2. 設定建置命令：`npm run build`
3. 設定發布目錄：`dist`
4. 設定環境變數

### 手動部署

```bash
# 建置
npm run build

# 上傳 dist 目錄到您的伺服器
```

## 🔧 環境變數

| 變數名稱 | 說明 | 預設值 |
|---------|------|--------|
| `VITE_API_BASE_URL` | 後端 API 基礎 URL | `http://localhost:8000` |
| `VITE_APP_NAME` | 應用程式名稱 | `背單字 App` |
| `VITE_APP_VERSION` | 應用程式版本 | `1.0.0` |
| `VITE_DEBUG` | 除錯模式 | `false` |

## 📱 響應式設計

### 斷點

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### 行動裝置優化

- 觸控友好的介面
- 適當的按鈕大小
- 簡化的導航
- 離線功能

## 🎯 效能優化

### 程式碼分割

使用 React.lazy 進行路由層級的程式碼分割：

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

### 圖片優化

- 使用適當的圖片格式
- 延遲載入
- 響應式圖片

### 快取策略

- Service Worker 快取
- API 回應快取
- 靜態資源快取

## 🔒 安全性

### 內容安全政策

設定適當的 CSP 標頭防止 XSS 攻擊。

### 認證

單人模式無需認證。若切回多使用者，請在前端重新啟用 token 攔截器並顯示登入頁。

## 🆘 常見問題

### PWA 不工作

確保：
- 使用 HTTPS（生產環境）
- manifest.json 正確配置
- Service Worker 註冊成功

### API 連線錯誤

檢查：
- `VITE_API_BASE_URL` 設定
- CORS 配置
- 網路連線

### 建置失敗

檢查：
- Node.js 版本
- 依賴版本
- 環境變數設定

## 📞 支援

如有問題，請建立 [Issue](https://github.com/your-username/vocab-app/issues)

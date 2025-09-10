# 背單字網站 (Vocab App)

一個功能完整的背單字網站（支援單人模式），支援 SRS 間隔重複學習、PWA 離線使用、資料匯入匯出等功能。

## 🚀 功能特色

- **單人模式**：免登入，開站即用（可切換回多使用者）
- **單字管理**：CRUD 操作、多義詞、詞性、例句、音標、標籤
- **SRS 學習**：間隔重複學習系統，根據答對率調整複習間隔
- **進階篩選**：日期、字母、標籤、熟悉度、同義詞群組
- **PWA 支援**：離線可用、Service Worker 快取
- **資料匯入匯出**：CSV/JSON 格式
- **響應式設計**：支援桌面和行動裝置

## 🏗️ 技術架構

### 後端
- **FastAPI** + **SQLModel** (ORM)
- 單人模式（SINGLE_USER_MODE=true）或多使用者（JWT）
- **SQLite** (預設) / **PostgreSQL** (可選)
- **slowapi** 速率限制
- **pytest** 測試

### 前端
- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** 樣式
- **Zustand** 狀態管理（單人模式免登入）
- **react-hook-form** + **zod** 表單驗證
- **PWA** 支援

## 📁 專案結構

```
vocab-app/
├── server/                 # 後端 FastAPI 應用
│   ├── app/
│   │   ├── main.py        # 應用程式入口
│   │   ├── models.py      # 資料模型
│   │   ├── schemas.py     # Pydantic 模式
│   │   ├── auth.py        # 認證邏輯
│   │   ├── routers/       # API 路由
│   │   └── utils/         # 工具函數
│   ├── tests/             # 測試檔案
│   └── requirements.txt   # Python 依賴
├── web/                   # 前端 React 應用
│   ├── src/
│   │   ├── components/    # React 組件
│   │   ├── pages/         # 頁面組件
│   │   ├── store/         # Zustand 狀態
│   │   └── api/           # API 客戶端
│   └── package.json       # Node.js 依賴
├── docker-compose.yml     # Docker 編排
└── .github/workflows/     # CI/CD 工作流程
```

## 🚀 快速開始

### 本機開發

1. **克隆專案**
   ```bash
   git clone <your-repo-url>
   cd word
   ```

2. **啟動後端**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # 編輯 .env 設定環境變數
   uvicorn app.main:app --reload
   ```

3. **啟動前端**
   ```bash
   cd web
   npm install
   cp .env.example .env
   # 編輯 .env 設定 VITE_API_BASE_URL
   npm run dev
   ```

4. **訪問應用**
   - 前端：http://localhost:5173
   - 後端 API：http://localhost:8000
   - API 文件：http://localhost:8000/docs

### Docker 啟動

```bash
# 使用 SQLite (預設)
docker-compose up -d

# 使用 PostgreSQL
docker-compose -f docker-compose.yml -f docker-compose.postgres.yml up -d
```

## 🔧 環境變數

### 後端 (.env)
```env
DATABASE_URL=sqlite:///./vocab.db
CORS_ORIGINS=http://localhost:5173
RATE_LIMIT_PER_MIN=120
RATE_LIMIT_BURST=200
# 單人模式
SINGLE_USER_MODE=true
DEFAULT_USER_EMAIL=singleuser@local
```

### 前端 (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🗄️ 資料庫

### SQLite (預設)
- 檔案：`server/vocab.db`
- 適合開發和小型部署

### PostgreSQL (生產環境)
```env
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/vocab_db
```

## 🚀 部署

### Render (後端)
1. 連接 GitHub 倉庫
2. 設定環境變數
3. 自動部署

### Vercel (前端)
1. 連接 GitHub 倉庫
2. 設定 `VITE_API_BASE_URL`
3. 自動部署

詳細部署步驟請參考：
- [後端部署指南](server/README.md#部署)
- [前端部署指南](web/README.md#部署)

## 🧪 測試

### 後端測試
```bash
cd server
pytest
```

### 前端測試
```bash
cd web
npm test
```

## 📱 PWA 功能

- 離線快取
- 安裝到桌面
- 推播通知 (可選)
- 背景同步

## 🔒 安全性

- 單人模式：免登入；多使用者時啟用 JWT
- CORS 保護
- 速率限制
- HTTPS 強制 (生產環境)

## 🤝 貢獻

1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 推送到分支
5. 建立 Pull Request

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 🆘 常見問題

### CORS 錯誤
確保 `CORS_ORIGINS` 包含前端網域

### JWT 失效
檢查 `JWT_SECRET` 和 `JWT_EXPIRE_HOURS` 設定

### PWA 快取問題
清除瀏覽器快取或重新安裝 PWA

## 📞 支援

如有問題，請建立 [Issue](https://github.com/your-username/vocab-app/issues)

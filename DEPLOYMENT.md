# 部署指南

本指南將協助您將背單字 App 部署到各種平台。

## 🚀 快速部署

### 使用 Docker Compose（推薦）

1. **克隆專案**
   ```bash
   git clone <your-repo-url>
   cd word
   ```

2. **啟動服務**
   ```bash
   # 使用 SQLite（預設）
   docker-compose up -d
   
   # 或使用 PostgreSQL
   docker-compose -f docker-compose.yml -f docker-compose.postgres.yml up -d
   ```

3. **訪問應用**
   - 前端：http://localhost:3000
   - 後端 API：http://localhost:8000
   - API 文件：http://localhost:8000/docs

## 🌐 雲端部署

### Render（後端）

1. **準備倉庫**
   - 將程式碼推送到 GitHub
   - 確保 `render.yaml` 檔案在根目錄

2. **建立 Render 服務**
   - 登入 [Render](https://render.com)
   - 點擊 "New +" → "Web Service"
   - 連接您的 GitHub 倉庫
   - 選擇 "Build and deploy from a Git repository"

3. **設定環境變數**
   ```
   DATABASE_URL=postgresql+psycopg://user:password@host:port/dbname
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
   JWT_EXPIRE_HOURS=12
   CORS_ORIGINS=https://your-frontend-domain.com
   RATE_LIMIT_PER_MIN=120
   RATE_LIMIT_BURST=200
   DEBUG=false
   ```

4. **設定建置和啟動命令**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **部署**
   - 點擊 "Create Web Service"
   - 等待部署完成

### Vercel（前端）

1. **準備專案**
   - 確保 `vercel.json` 檔案在根目錄
   - 前端程式碼在 `web/` 目錄

2. **部署到 Vercel**
   - 登入 [Vercel](https://vercel.com)
   - 點擊 "New Project"
   - 連接您的 GitHub 倉庫
   - 設定專案：
     - Framework Preset: Vite
     - Root Directory: `web`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **設定環境變數**
   ```
   VITE_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

4. **部署**
   - 點擊 "Deploy"
   - 等待部署完成

### Railway

1. **準備專案**
   - 將程式碼推送到 GitHub

2. **部署到 Railway**
   - 登入 [Railway](https://railway.app)
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **設定服務**
   - 後端：選擇 `server/` 目錄
   - 前端：選擇 `web/` 目錄
   - 設定環境變數

4. **部署**
   - Railway 會自動偵測並部署

### Fly.io

1. **安裝 Fly CLI**
   ```bash
   # macOS
   brew install flyctl
   
   # Windows
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **登入 Fly.io**
   ```bash
   fly auth login
   ```

3. **建立 fly.toml**
   ```toml
   # fly.toml for backend
   app = "vocab-api"
   primary_region = "nrt"
   
   [build]
   
   [env]
     DATABASE_URL = "sqlite:///./vocab.db"
     JWT_SECRET = "your-secret-key"
   
   [[services]]
     http_checks = []
     internal_port = 8000
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
   
     [services.concurrency]
       hard_limit = 25
       soft_limit = 20
       type = "connections"
   
     [[services.ports]]
       force_https = true
       handlers = ["http"]
       port = 80
   
     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443
   
     [[services.tcp_checks]]
       grace_period = "1s"
       interval = "15s"
       restart_limit = 0
       timeout = "2s"
   ```

4. **部署**
   ```bash
   cd server
   fly deploy
   ```

## 🗄️ 資料庫設定

### SQLite（開發/小型部署）

預設使用 SQLite，無需額外設定。

### PostgreSQL（生產環境）

1. **建立資料庫**
   ```sql
   CREATE DATABASE vocab_db;
   CREATE USER vocab_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE vocab_db TO vocab_user;
   ```

2. **設定環境變數**
   ```
   DATABASE_URL=postgresql+psycopg://vocab_user:your_password@host:port/vocab_db
   ```

3. **執行遷移（可選）**
   ```bash
   cd server
   alembic upgrade head
   ```

## 🔧 環境變數設定

### 後端環境變數

| 變數名稱 | 說明 | 範例值 |
|---------|------|--------|
| `DATABASE_URL` | 資料庫連接字串 | `postgresql+psycopg://user:pass@host:port/db` |
| `JWT_SECRET` | JWT 密鑰 | `your-super-secret-key-32-chars` |
| `JWT_EXPIRE_HOURS` | JWT 過期時間 | `12` |
| `CORS_ORIGINS` | 允許的 CORS 來源 | `https://your-frontend.com` |
| `RATE_LIMIT_PER_MIN` | 每分鐘請求限制 | `120` |
| `RATE_LIMIT_BURST` | 突發請求限制 | `200` |
| `DEBUG` | 除錯模式 | `false` |

### 前端環境變數

| 變數名稱 | 說明 | 範例值 |
|---------|------|--------|
| `VITE_API_BASE_URL` | 後端 API URL | `https://your-api.com` |
| `VITE_APP_NAME` | 應用程式名稱 | `背單字 App` |
| `VITE_APP_VERSION` | 應用程式版本 | `1.0.0` |
| `VITE_DEBUG` | 除錯模式 | `false` |

## 🔒 安全性設定

### HTTPS

確保生產環境使用 HTTPS：

1. **後端**：使用反向代理（如 Nginx）或雲端平台的 SSL
2. **前端**：Vercel/Netlify 自動提供 HTTPS

### CORS 設定

設定正確的 CORS 來源：

```env
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### JWT 密鑰

使用強隨機密鑰：

```bash
# 生成隨機密鑰
openssl rand -hex 32
```

## 📊 監控和日誌

### 健康檢查

後端提供健康檢查端點：

```bash
curl https://your-api.com/health
```

### 日誌

- **Render**：自動收集日誌
- **Vercel**：在儀表板查看日誌
- **Railway**：提供日誌查看
- **Fly.io**：使用 `fly logs`

## 🚀 CI/CD 設定

### GitHub Actions

1. **設定 Secrets**
   - `RENDER_SERVICE_ID`：Render 服務 ID
   - `RENDER_API_KEY`：Render API 金鑰
   - `VERCEL_TOKEN`：Vercel 部署 token
   - `VERCEL_ORG_ID`：Vercel 組織 ID
   - `VERCEL_PROJECT_ID`：Vercel 專案 ID

2. **自動部署**
   - 推送到 `main` 分支會自動觸發部署
   - 也可以手動觸發部署

### 手動部署

```bash
# 後端
cd server
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 前端
cd web
npm install
npm run build
# 上傳 dist 目錄到您的伺服器
```

## 🆘 常見問題

### 部署失敗

1. **檢查環境變數**：確保所有必要的環境變數都已設定
2. **檢查依賴**：確保所有依賴都能正確安裝
3. **檢查日誌**：查看部署平台的日誌找出問題

### CORS 錯誤

1. **檢查 CORS_ORIGINS**：確保包含正確的前端網域
2. **檢查協議**：確保 HTTP/HTTPS 設定正確

### 資料庫連接錯誤

1. **檢查 DATABASE_URL**：確保格式正確
2. **檢查網路**：確保能連接到資料庫
3. **檢查權限**：確保資料庫使用者有適當權限

### PWA 不工作

1. **檢查 HTTPS**：PWA 需要 HTTPS
2. **檢查 manifest**：確保 manifest.json 正確
3. **檢查 Service Worker**：確保正確註冊

## 📞 支援

如有部署問題，請：

1. 查看平台文件
2. 檢查 GitHub Issues
3. 建立新的 Issue 描述問題

## 🔄 更新部署

### 自動更新

如果設定了 CI/CD，推送到 `main` 分支會自動更新部署。

### 手動更新

```bash
# 拉取最新程式碼
git pull origin main

# 重新部署
docker-compose up -d --build
```

## 📈 效能優化

### 後端優化

1. **使用 PostgreSQL**：比 SQLite 更適合生產環境
2. **設定快取**：使用 Redis 快取
3. **負載平衡**：使用多個實例

### 前端優化

1. **CDN**：使用 CDN 加速靜態資源
2. **壓縮**：啟用 Gzip 壓縮
3. **快取**：設定適當的快取策略


import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Save, Trash2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../store/auth'

const updateUserSchema = z.object({
  username: z.string().min(3, '使用者名稱至少需要 3 個字元'),
  email: z.string().email('請輸入有效的電子郵件地址'),
  full_name: z.string().optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入目前密碼'),
  newPassword: z.string().min(6, '新密碼至少需要 6 個字元'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '密碼確認不一致',
  path: ['confirmPassword'],
})

type UpdateUserForm = z.infer<typeof updateUserSchema>
type ChangePasswordForm = z.infer<typeof changePasswordSchema>

const Settings = () => {
  const auth = useAuth()
  const user = auth.user ?? { username: '', email: '', full_name: '' as string | undefined }
  const isLoading = auth.isLoading ?? false
  const error = auth.error ?? null
  const clearError = auth.clearError ?? (() => {})
  const singleUserMode = auth.singleUserMode ?? true

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'danger'>('profile')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: (user as any).username || '',
      email: (user as any).email || '',
      full_name: (user as any).full_name || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onProfileSubmit = async (data: UpdateUserForm) => {
    try {
      clearError()
      if (auth.updateUser) {
        await auth.updateUser(data)
      } else {
        console.info('[Settings] updateUser 未實作（單人模式下可選擇不提供）', data)
      }
    } catch {
      /* 錯誤已在 store 中處理（若有） */
    }
  }

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    try {
      clearError()
      if (auth.updateUser) {
        await auth.updateUser({ password: data.newPassword } as any)
        resetPassword()
      } else {
        console.info('[Settings] updateUser 未實作，略過改密碼')
      }
    } catch {
      /* 錯誤已在 store 中處理（若有） */
    }
  }

  const handleDeleteAccount = async () => {
    if (singleUserMode) return
    if (!auth.deleteUser) return
    if (window.confirm('確定要刪除帳號嗎？此操作無法復原！')) {
      try {
        await auth.deleteUser()
      } catch {
        /* 錯誤已在 store 中處理（若有） */
      }
    }
  }

  const tabs = [
    { id: 'profile', name: '個人資料', icon: User },
    { id: 'password', name: '修改密碼', icon: Save },
    { id: 'danger', name: '危險區域', icon: AlertTriangle },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600">管理您的帳號設定和偏好</p>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-sm text-danger-600">{String(error)}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 側邊欄 */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 w-5 h-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* 主要內容 */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* 個人資料 */}
            {activeTab === 'profile' && (
              <div>
                <div className="card-header">
                  <h2 className="card-title">個人資料</h2>
                  <p className="card-subtitle">更新您的個人資訊</p>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="label">
                      使用者名稱
                    </label>
                    <input
                      {...registerProfile('username')}
                      type="text"
                      className={profileErrors.username ? 'input-error' : 'input'}
                    />
                    {profileErrors.username && (
                      <p className="error-message">{profileErrors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      電子郵件
                    </label>
                    <input
                      {...registerProfile('email')}
                      type="email"
                      className={profileErrors.email ? 'input-error' : 'input'}
                    />
                    {profileErrors.email && (
                      <p className="error-message">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="full_name" className="label">
                      姓名
                    </label>
                    <input {...registerProfile('full_name')} type="text" className="input" />
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isLoading} className="btn-primary">
                      {isLoading ? '儲存中...' : '儲存變更'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 修改密碼 */}
            {activeTab === 'password' && (
              <div>
                <div className="card-header">
                  <h2 className="card-title">修改密碼</h2>
                  <p className="card-subtitle">
                    {singleUserMode ? '單人模式：密碼非必要，但仍可更新' : '更新您的登入密碼'}
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="label">
                      目前密碼
                    </label>
                    <input
                      {...registerPassword('currentPassword')}
                      type="password"
                      className={passwordErrors.currentPassword ? 'input-error' : 'input'}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="error-message">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="label">
                      新密碼
                    </label>
                    <input
                      {...registerPassword('newPassword')}
                      type="password"
                      className={passwordErrors.newPassword ? 'input-error' : 'input'}
                    />
                    {passwordErrors.newPassword && (
                      <p className="error-message">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="label">
                      確認新密碼
                    </label>
                    <input
                      {...registerPassword('confirmPassword')}
                      type="password"
                      className={passwordErrors.confirmPassword ? 'input-error' : 'input'}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="error-message">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isLoading} className="btn-primary">
                      {isLoading ? '更新中...' : '更新密碼'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 危險區域 */}
            {activeTab === 'danger' && (
              <div>
                <div className="card-header">
                  <h2 className="card-title text-danger-600">危險區域</h2>
                  <p className="card-subtitle">不可復原的操作</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-danger-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-danger-800">刪除帳號</h3>
                        <p className="text-sm text-danger-700 mt-1">
                          永久刪除您的帳號和所有相關資料。此操作無法復原。
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() =>
                              singleUserMode ? null : setShowDeleteConfirm(true)
                            }
                            disabled={singleUserMode || isLoading || !auth.deleteUser}
                            className={`btn-danger ${
                              singleUserMode ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={singleUserMode ? '單人模式下禁止刪除預設帳號' : ''}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除帳號
                          </button>
                          {singleUserMode && (
                            <p className="text-xs text-gray-500 mt-2">
                              單人模式下為避免系統不可用，停用刪除帳號功能。
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 刪除確認對話框 */}
      {showDeleteConfirm && !singleUserMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-600 opacity-75"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-danger-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">確認刪除帳號</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              您確定要刪除您的帳號嗎？這將永久刪除您的所有資料，包括單字、複習記錄等。此操作無法復原。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || !auth.deleteUser}
                className="btn-danger flex-1"
              >
                {isLoading ? '刪除中...' : '確認刪除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings


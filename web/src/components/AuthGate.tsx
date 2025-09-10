import { ReactNode } from 'react'

export default function AuthGate({ children }: { children: ReactNode }) {
  // 單人模式：不攔截
  return <>{children}</>
}

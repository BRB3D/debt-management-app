'use client'

import * as Toast from '@radix-ui/react-toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <Toast.Provider>{children}</Toast.Provider>
}

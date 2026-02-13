import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { ToastProvider } from './components/toast-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}

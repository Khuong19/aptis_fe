import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APTIS Learning Platform',
  description: 'Practice and improve your English skills for the APTIS test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <Toaster position="top-right" />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 
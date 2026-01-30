import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo List - MyMoltBot',
  description: 'A modern todo list application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {children}
      </body>
    </html>
  )
}

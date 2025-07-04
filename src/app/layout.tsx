import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { AuthProvider } from '../hooks/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Canara Bank - Together We Can',
  description: 'Professional banking application with advanced security features and comprehensive financial solutions',
  keywords: 'banking, security, authentication, financial, secure, canara bank',
  authors: [{ name: 'Canara Bank' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0073e6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} h-full bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden`}>
        <ThemeProvider>
          <AuthProvider>
            <div id="root" className="h-full min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
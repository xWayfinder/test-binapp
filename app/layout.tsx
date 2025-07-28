import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { NavBar } from './components/nav-bar'
import { GoogleMapsScript } from '@/components/google-maps-script'
import { PostHogProvider } from '@/components/posthog-provider'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BinsOut - Your Bin Collection Schedule',
  description: 'Find out when your bins are collected',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              <main className="min-h-screen">
                {children}
              </main>
              <GoogleMapsScript />
            </ThemeProvider>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}

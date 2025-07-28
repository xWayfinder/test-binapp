'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize PostHog
    initPostHog()
  }, [])

  useEffect(() => {
    // Track pageviews
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

// Custom hook for using PostHog throughout the app
export function usePostHog() {
  return posthog
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePostHog } from '@/components/posthog-provider'
import ErrorScreen from '@/app/components/error-screen'

interface ErrorPageClientProps {
  address: string
  onTryAgain: () => Promise<{ success: boolean; redirect: string }>
}

export default function ErrorPageClient({ address, onTryAgain }: ErrorPageClientProps) {
  const posthog = usePostHog()
  const router = useRouter()

  // Track when error screen is viewed
  useEffect(() => {
    posthog.capture('search_error', {
      address: address,
      error_reason: 'invalid_location_or_too_short',
      address_length: address.length
    })

    posthog.capture('error_screen_viewed', {
      failed_address: address,
      address_length: address.length
    })
  }, [posthog, address])

  const handleTryAgainClick = async () => {
    posthog.capture('try_again_clicked', {
      previous_address: address
    })

    const result = await onTryAgain()
    if (result.success) {
      router.push(result.redirect)
    }
  }

  return (
    <ErrorScreen
      address={address}
      onTryAgain={handleTryAgainClick}
    />
  )
}
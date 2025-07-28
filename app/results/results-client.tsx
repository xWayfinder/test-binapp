'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePostHog } from '@/components/posthog-provider'
import ResultsScreen from '@/app/components/results-screen'
import type { BinData } from '@/types'

interface ResultsPageClientProps {
  address: string
  binData: BinData
  onNewSearch: () => Promise<{ success: boolean; redirect: string }>
}

export default function ResultsPageClient({ address, binData, onNewSearch }: ResultsPageClientProps) {
  const posthog = usePostHog()
  const router = useRouter()

  // Track when results screen is viewed
  useEffect(() => {
    posthog.capture('search_success', {
      address: address,
      zone: binData.zone,
      collection_date: binData.nextCollection.date,
      bin_types: binData.nextCollection.bins.map(bin => bin.type),
      num_bins: binData.nextCollection.bins.length
    })

    posthog.capture('results_screen_viewed', {
      address: address,
      zone: binData.zone,
      collection_date: binData.nextCollection.date,
      bin_types: binData.nextCollection.bins.map(bin => bin.type),
      num_bins: binData.nextCollection.bins.length
    })
  }, [posthog, address, binData])

  const handleNewSearchClick = async () => {
    posthog.capture('new_search_clicked', {
      previous_address: address,
      previous_zone: binData.zone
    })

    const result = await onNewSearch()
    if (result.success) {
      router.push(result.redirect)
    }
  }

  return (
    <ResultsScreen
      address={address}
      binData={binData}
      onNewSearch={handleNewSearchClick}
    />
  )
}
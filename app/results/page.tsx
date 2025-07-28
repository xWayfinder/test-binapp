import { redirect } from 'next/navigation'
import ResultsPageClient from './results-client'
import { handleNewSearch } from '../actions'
import type { BinData } from '@/types'

async function getBinData(address: string, zone: string): Promise<BinData> {
  // Simulate API call with mock data for collection schedules
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const binSchedules = [
    {
      date: "Thursday, 30 January 2025",
      bins: [
        { type: "general" as const, name: "General Waste", color: "bg-chart-1" },
        { type: "recycling" as const, name: "Recycling", color: "bg-chart-2" },
      ],
    },
    {
      date: "Friday, 31 January 2025",
      bins: [
        { type: "general" as const, name: "General Waste", color: "bg-chart-1" },
        { type: "green" as const, name: "Green Waste", color: "bg-chart-3" },
      ],
    },
    {
      date: "Monday, 3 February 2025",
      bins: [
        { type: "recycling" as const, name: "Recycling", color: "bg-chart-2" },
        { type: "green" as const, name: "Green Waste", color: "bg-chart-3" },
      ],
    },
  ]

  // For now, just pick a random schedule
  // TODO: In the future, determine the actual schedule based on the zone
  const randomSchedule = binSchedules[Math.floor(Math.random() * binSchedules.length)]

  return {
    zone,
    nextCollection: randomSchedule,
  }
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const address = searchParams.address
  const zone = searchParams.zone

  if (!address || !zone) {
    redirect('/')
  }

  const binData = await getBinData(address, zone)

  return (
    <ResultsPageClient
      address={address}
      binData={binData}
      onNewSearch={handleNewSearch}
    />
  )
} 
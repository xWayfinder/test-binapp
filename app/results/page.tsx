import { redirect } from 'next/navigation'
import ResultsPageClient from './results-client'
import { handleNewSearch } from '../actions'
import type { BinData } from '@/types'

async function getBinData(address: string): Promise<BinData> {
  // Simulate API call with mock data
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock validation
  const isValidMelbourne =
    address.toLowerCase().includes("123 collins street, melbourne vic 3000") ||
    (address.toLowerCase().includes("collins street") && address.toLowerCase().includes("melbourne"))

  if (!isValidMelbourne || address.trim().length < 10) {
    redirect('/error?address=' + encodeURIComponent(address))
  }

  // Mock bin data based on address
  const zones = ["Zone A", "Zone B", "Zone C"]
  const randomZone = zones[Math.floor(Math.random() * zones.length)]

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

  const randomSchedule = binSchedules[Math.floor(Math.random() * binSchedules.length)]

  return {
    zone: randomZone,
    nextCollection: randomSchedule,
  }
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const address = searchParams.address

  if (!address) {
    redirect('/')
  }

  const binData = await getBinData(address)

  return (
    <ResultsPageClient
      address={address}
      binData={binData}
      onNewSearch={handleNewSearch}
    />
  )
} 
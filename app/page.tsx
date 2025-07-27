"use client"

import { useState } from "react"
import HomeScreen from "./components/home-screen"
import ResultsScreen from "./components/results-screen"
import ErrorScreen from "./components/error-screen"

export type BinData = {
  zone: string
  nextCollection: {
    date: string
    bins: Array<{
      type: "general" | "recycling" | "green"
      name: string
      color: string
    }>
  }
}

export default function BinApp() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "results" | "error">("home")
  const [address, setAddress] = useState("")
  const [binData, setBinData] = useState<BinData | null>(null)

  const handleAddressSubmit = async (inputAddress: string) => {
    setAddress(inputAddress)

    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation - hardcode specific address for demo
    const isValidMelbourne =
      inputAddress.toLowerCase().includes("123 collins street, melbourne vic 3000") ||
      (inputAddress.toLowerCase().includes("collins street") && inputAddress.toLowerCase().includes("melbourne"))

    if (!isValidMelbourne || inputAddress.trim().length < 10) {
      setCurrentScreen("error")
      return
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

    setBinData({
      zone: randomZone,
      nextCollection: randomSchedule,
    })

    setCurrentScreen("results")
  }

  const handleTryAgain = () => {
    setCurrentScreen("home")
    setAddress("")
    setBinData(null)
  }

  const handleNewSearch = () => {
    setCurrentScreen("home")
    setAddress("")
    setBinData(null)
  }

  return (
    <div className="min-h-screen">
      {currentScreen === "home" && <HomeScreen onAddressSubmit={handleAddressSubmit} />}

      {currentScreen === "results" && binData && (
        <ResultsScreen address={address} binData={binData} onNewSearch={handleNewSearch} />
      )}

      {currentScreen === "error" && <ErrorScreen address={address} onTryAgain={handleTryAgain} />}
    </div>
  )
}

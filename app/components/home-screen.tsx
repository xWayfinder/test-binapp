"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Trash2 } from "lucide-react"
import { useGooglePlaces } from "@/hooks/use-google-places"
import { cn } from "@/lib/utils"

interface HomeScreenProps {
  onAddressSubmit: (address: string) => Promise<void>
}

export default function HomeScreen({ onAddressSubmit }: HomeScreenProps) {
  const [address, setAddress] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleAddressSelect = useCallback((selectedAddress: string) => {
    console.log('Address selected:', selectedAddress)
    setAddress(selectedAddress)
  }, [])

  const handleAddressSubmit = useCallback(async (selectedAddress: string) => {
    console.log('Submitting address:', selectedAddress)
    await onAddressSubmit(selectedAddress)
  }, [onAddressSubmit])

  const { inputRef, isLoaded, isLoading } = useGooglePlaces({
    onAddressSelect: handleAddressSelect,
    onAddressSubmit: handleAddressSubmit
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim() || isLoading) return

    try {
      console.log('Manual submit with address:', address)
      await onAddressSubmit(address)
    } catch (error) {
      console.error('Error submitting address:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-8">
            <Trash2 className="w-24 h-24 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Melbourne Bin Collection</h1>
          <p className="text-xl text-muted-foreground mb-8">Find your bin collection schedule</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
          <div className="relative group">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                  "w-full pl-12 pr-4 py-6 text-lg rounded-full transition-all duration-200",
                  "border-2 focus-visible:ring-offset-2",
                  "hover:border-border focus-visible:border-primary",
                  isFocused ? "shadow-md" : "shadow-sm hover:shadow-md"
                )}
                disabled={isLoading || !isLoaded}
                required
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              size="lg"
              className="text-base px-8"
              disabled={isLoading || !address.trim() || !isLoaded}
            >
              {isLoading ? "Finding your bin night..." : "Find my bin night"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Example:</span> 123 Collins Street, Melbourne VIC 3000
            </p>
          </div>
        </form>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>Melbourne City Council Waste Management</p>
        </div>
      </div>
    </div>
  )
}

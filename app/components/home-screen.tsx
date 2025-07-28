"use client"

import type React from "react"
import { useState, useCallback, useTransition } from "react"
import { useRouter } from "next/navigation"
import { usePostHog } from "@/components/posthog-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Trash2 } from "lucide-react"
import { useGooglePlaces } from "@/hooks/use-google-places"
import { cn } from "@/lib/utils"

interface HomeScreenProps {
  onAddressSubmit: (address: string, coordinates?: { lat: number; lng: number }) => Promise<{ success: boolean; redirect: string }>
}

export default function HomeScreen({ onAddressSubmit }: HomeScreenProps) {
  const [address, setAddress] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>()
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const posthog = usePostHog()

  const handleAddressSelect = useCallback((selectedAddress: string, coords?: { lat: number; lng: number }) => {
    console.log('Address selected:', selectedAddress, 'coordinates:', coords)
    setAddress(selectedAddress)
    setCoordinates(coords)
    
    // Track address selection from Google Places
    posthog.capture('address_selected_from_places', {
      address_length: selectedAddress.length,
      has_melbourne: selectedAddress.toLowerCase().includes('melbourne'),
      selection_method: 'google_places',
      has_coordinates: !!coords
    })
  }, [posthog])

  const handleAddressSubmit = useCallback(async (selectedAddress: string, coords?: { lat: number; lng: number }) => {
    console.log('Submitting address:', selectedAddress, 'coordinates:', coords)
    
    // Track address submission
    posthog.capture('address_submitted', {
      address_length: selectedAddress.length,
      has_melbourne: selectedAddress.toLowerCase().includes('melbourne'),
      has_collins_street: selectedAddress.toLowerCase().includes('collins street'),
      submission_method: 'google_places_submit',
      has_coordinates: !!coords
    })
    
    startTransition(async () => {
      const result = await onAddressSubmit(selectedAddress, coords)
      if (result.success) {
        router.push(result.redirect)
      }
    })
  }, [onAddressSubmit, router, posthog])

  const { inputRef, isLoaded } = useGooglePlaces({
    onAddressSelect: handleAddressSelect,
    onAddressSubmit: handleAddressSubmit
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim() || isPending) return

    try {
      console.log('Manual submit with address:', address, 'coordinates:', coordinates)
      
      // Track manual address submission
      posthog.capture('address_submitted', {
        address_length: address.length,
        has_melbourne: address.toLowerCase().includes('melbourne'),
        has_collins_street: address.toLowerCase().includes('collins street'),
        submission_method: 'manual_form_submit',
        has_coordinates: !!coordinates
      })
      
      startTransition(async () => {
        const result = await onAddressSubmit(address, coordinates)
        if (result.success) {
          router.push(result.redirect)
        }
      })
    } catch (error) {
      console.error('Error submitting address:', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Find Your Bin Collection Zone</h1>
          <p className="text-sm text-muted-foreground">
            Enter your address to see your bin collection schedule
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter your address..."
              className={cn(
                "pl-4 pr-8 py-6 text-lg rounded-full transition-all duration-200",
                "border-2 focus-visible:ring-offset-2",
                "hover:border-border focus-visible:border-primary",
                isFocused ? "shadow-md" : "shadow-sm hover:shadow-md",
                "bg-background"
              )}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required
            />
            {address && (
              <button
                type="button"
                onClick={() => {
                  setAddress("")
                  setCoordinates(undefined)
                  if (inputRef.current) {
                    inputRef.current.value = ""
                    inputRef.current.focus()
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-full py-6 text-lg"
            disabled={!address.trim() || isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Search</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

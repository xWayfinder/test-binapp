'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function GoogleMapsScript() {
  const { toast } = useToast()

  useEffect(() => {
    // Debug: Log API key presence (not the actual key)
    console.log('Google Maps API Key present:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not set')
      toast({
        title: "Configuration Error",
        description: "Address autocomplete is currently unavailable. Please check environment variables.",
        variant: "destructive",
      })
    }

    // Handle Google Maps API errors
    const handleGoogleMapsError = (e: ErrorEvent) => {
      // Debug: Log the full error for debugging
      console.error('Google Maps Error:', {
        message: e.error?.message,
        stack: e.error?.stack,
        type: e.error?.name,
        raw: e
      })

      if (e.error?.message?.includes('ApiTargetBlockedMapError')) {
        toast({
          title: "Domain Not Authorized",
          description: "Please add this domain to the allowed referrers in Google Cloud Console.",
          variant: "destructive",
        })
      } else if (e.error?.message?.includes('InvalidKeyMapError')) {
        toast({
          title: "Invalid API Key",
          description: "Please check the API key in your environment variables.",
          variant: "destructive",
        })
      } else if (e.error?.message?.includes('RefererNotAllowedMapError')) {
        toast({
          title: "API Not Enabled",
          description: "Please enable 'Places API' and 'Maps JavaScript API' in Google Cloud Console.",
          variant: "destructive",
        })
      } else if (e.error?.message?.includes('MissingKeyMapError')) {
        toast({
          title: "Missing API Key",
          description: "Please check your environment variables.",
          variant: "destructive",
        })
      } else {
        // Log unknown errors
        console.error('Unknown Google Maps error:', e.error)
        toast({
          title: "Unknown Error",
          description: "An unexpected error occurred. Check the console for details.",
          variant: "destructive",
        })
      }
    }

    window.addEventListener('error', handleGoogleMapsError)
    
    return () => {
      window.removeEventListener('error', handleGoogleMapsError)
    }
  }, [toast])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return null
  }

  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`}
      onLoad={() => {
        console.log('Google Maps script loaded')
        // Verify Places API is available
        if (!window.google?.maps?.places) {
          console.error('Places API not available in window.google.maps')
          toast({
            title: "API Error",
            description: "Places API not available. Please check API enablement in Google Cloud Console.",
            variant: "destructive",
          })
          return
        }
        console.log('Places API available')
        window.dispatchEvent(new Event('google-maps-loaded'))
      }}
      onError={(e) => {
        console.error('Script loading error:', e)
        toast({
          title: "Loading Error",
          description: "Failed to load Google Maps. Check your internet connection and API configuration.",
          variant: "destructive",
        })
      }}
      strategy="afterInteractive"
    />
  )
} 
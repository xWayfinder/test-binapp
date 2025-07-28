import { useEffect, useRef, useState } from 'react'

type GooglePlacesHookProps = {
  onAddressSelect?: (address: string, coordinates?: { lat: number; lng: number }) => void
  onAddressSubmit?: (address: string, coordinates?: { lat: number; lng: number }) => Promise<void>
}

export function useGooglePlaces({ onAddressSelect, onAddressSubmit }: GooglePlacesHookProps) {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Initialize Google Places Autocomplete when the script is loaded
    const initializePlaces = () => {
      if (!inputRef.current || !window.google) return

      // Add custom styles to match our theme
      const customStyles = document.createElement('style')
      customStyles.textContent = `
        .pac-container {
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          font-family: var(--font-sans);
          z-index: 1100;
        }
        .pac-item {
          padding: 0.5rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          border-top: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pac-item:hover {
          background-color: hsl(var(--accent));
        }
        .pac-item-selected {
          background-color: hsl(var(--accent));
        }
        .pac-icon {
          display: none;
        }
        .pac-item-query {
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: hsl(var(--foreground));
          font-weight: 500;
        }
        .pac-matched {
          color: hsl(var(--primary));
          font-weight: 600;
        }
        .pac-item span:not(.pac-item-query) {
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: hsl(var(--muted-foreground));
        }
      `
      document.head.appendChild(customStyles)

      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: 'au' },
          fields: ['formatted_address', 'name', 'geometry'],
          types: ['address']
        }
      )

      // Add place_changed event listener
      autoCompleteRef.current.addListener('place_changed', async () => {
        const place = autoCompleteRef.current?.getPlace()
        console.log('Place selected:', place) // Debug log

        if (!place) {
          console.error('No place details available')
          return
        }

        const address = place.formatted_address || place.name
        if (!address) {
          console.error('No address available in place details')
          return
        }

        // Get coordinates if available
        const coordinates = place.geometry?.location ? {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        } : undefined

        console.log('Setting address:', address, 'coordinates:', coordinates) // Debug log
        
        // Update input value directly to ensure it's set
        if (inputRef.current) {
          inputRef.current.value = address
        }

        // Notify parent components
        if (onAddressSelect) {
          onAddressSelect(address, coordinates)
        }
        
        // Submit if handler provided
        if (onAddressSubmit) {
          try {
            setIsLoading(true)
            console.log('Submitting address:', address, 'coordinates:', coordinates) // Debug log
            await onAddressSubmit(address, coordinates)
          } catch (error) {
            console.error('Error submitting address:', error)
          } finally {
            setIsLoading(false)
          }
        }
      })

      setIsLoaded(true)
    }

    // Check if Google Maps script is already loaded
    if (window.google?.maps) {
      initializePlaces()
    } else {
      // Script will be loaded in layout.tsx
      const googleMapsListener = () => {
        initializePlaces()
      }
      window.addEventListener('google-maps-loaded', googleMapsListener)
      return () => {
        window.removeEventListener('google-maps-loaded', googleMapsListener)
      }
    }

    // Cleanup function to remove styles
    return () => {
      const style = document.querySelector('style')
      if (style?.textContent?.includes('.pac-container')) {
        style.remove()
      }
    }
  }, [onAddressSelect, onAddressSubmit])

  return {
    inputRef,
    isLoaded,
    isLoading
  }
} 
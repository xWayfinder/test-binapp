import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeAddress(address: string): string {
  return encodeURIComponent(address)
}

export function decodeAddress(encodedAddress: string): string {
  return decodeURIComponent(encodedAddress)
}

export function getAddressFromSearchParams(searchParams: URLSearchParams): string | null {
  const address = searchParams.get('address')
  return address ? decodeAddress(address) : null
}

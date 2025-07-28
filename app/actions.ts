'use server'

import { encodeAddress } from '@/lib/utils'

export async function submitAddress(address: string) {
  const encodedAddress = encodeAddress(address)
  return { success: true, redirect: `/results?address=${encodedAddress}` }
}

export async function handleNewSearch() {
  return { success: true, redirect: '/' }
}

export async function handleTryAgain() {
  return { success: true, redirect: '/' }
} 
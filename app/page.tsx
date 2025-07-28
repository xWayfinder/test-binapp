"use client"

import HomeScreen from '@/app/components/home-screen'
import { submitAddress } from './actions'

export default function HomePage() {
  return <HomeScreen onAddressSubmit={submitAddress} />
}

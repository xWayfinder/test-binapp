import { redirect } from 'next/navigation'
import ErrorPageClient from './error-client'
import { handleTryAgain } from '../actions'

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const address = searchParams.address
  
  if (!address) {
    redirect('/')
  }

  return (
    <ErrorPageClient
      address={address}
      onTryAgain={handleTryAgain}
    />
  )
} 
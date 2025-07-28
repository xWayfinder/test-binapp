import { redirect } from 'next/navigation'
import ErrorScreen from '@/app/components/error-screen'
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
    <ErrorScreen
      address={address}
      onTryAgain={handleTryAgain}
    />
  )
} 
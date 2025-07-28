import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // Only initialize PostHog on the client side
    posthog.init(
      process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc-placeholder-key',
      {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // Only create profiles for identified users
        capture_pageview: false, // We'll capture pageviews manually
        capture_pageleave: true,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded successfully')
          }
        }
      }
    )
  }
}

export { posthog }
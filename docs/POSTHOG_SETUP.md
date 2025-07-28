# PostHog Analytics Setup

This document explains how to set up and use PostHog analytics in the Melbourne Bin Collection app.

## Setup

### 1. Install Dependencies

PostHog has already been installed as a dependency:

```bash
pnpm add posthog-js
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your PostHog configuration:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc-your-posthog-project-key-here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Get your PostHog project key from your PostHog dashboard at [posthog.com](https://posthog.com).

### 3. PostHog Project Setup

1. Sign up for PostHog at [posthog.com](https://posthog.com)
2. Create a new project
3. Copy your project API key (starts with `phc-`)
4. Choose the appropriate host based on your region:
   - US: `https://us.i.posthog.com`
   - EU: `https://eu.i.posthog.com`

## Architecture

The PostHog integration consists of:

- **`lib/posthog.ts`** - PostHog configuration and initialization
- **`components/posthog-provider.tsx`** - React provider component for PostHog
- **`app/layout.tsx`** - Root layout with PostHog provider integration

## Tracked Events

### Core User Journey Events

1. **`address_submitted`** - When user submits an address
   - `address_length`: Length of the submitted address
   - `has_melbourne`: Whether address contains "melbourne"
   - `has_collins_street`: Whether address contains "collins street"

2. **`search_success`** - When address search succeeds
   - `address`: The submitted address
   - `zone`: Assigned collection zone
   - `collection_date`: Next collection date
   - `bin_types`: Array of bin types for collection
   - `num_bins`: Number of bins for collection

3. **`search_error`** - When address search fails
   - `address`: The submitted address
   - `error_reason`: Reason for failure ('invalid_location' or 'address_too_short')
   - `address_length`: Length of the submitted address

### Screen View Events

4. **`results_screen_viewed`** - When user views collection results
   - `address`: User's address
   - `zone`: Collection zone
   - `collection_date`: Next collection date
   - `bin_types`: Array of bin types
   - `num_bins`: Number of bins

5. **`error_screen_viewed`** - When user sees error screen
   - `failed_address`: Address that failed validation
   - `address_length`: Length of the failed address

### Navigation Events

6. **`new_search_clicked`** - When user starts a new search from results
   - `previous_address`: Previous search address
   - `previous_zone`: Previous collection zone

7. **`try_again_clicked`** - When user tries again after error
   - `previous_address`: Address that failed

8. **`new_search_button_clicked`** - When user clicks "New Search" button
   - `from_address`: Current address
   - `from_zone`: Current zone

9. **`try_again_button_clicked`** - When user clicks "Try Again" button
   - `failed_address`: Address that failed
   - `location`: Screen location ('error_screen')

### UI Interaction Events

10. **`login_button_clicked`** - When user clicks login button
    - `location`: Where the login button was clicked ('home_screen')

11. **`address_input_focused`** - When user focuses on address input field

### Automatic Events

- **`$pageview`** - Automatic page view tracking
- **`$pageleave`** - When user leaves a page

## Usage in Components

### Using PostHog in Components

```tsx
import { usePostHog } from '@/components/posthog-provider'

export default function MyComponent() {
  const posthog = usePostHog()
  
  const handleButtonClick = () => {
    posthog.capture('button_clicked', {
      button_name: 'my_button',
      timestamp: new Date().toISOString()
    })
  }
  
  return <button onClick={handleButtonClick}>Click me</button>
}
```

### Adding New Events

To add new tracking events:

1. Import the PostHog hook: `import { usePostHog } from '@/components/posthog-provider'`
2. Get the PostHog instance: `const posthog = usePostHog()`
3. Call `posthog.capture()` with event name and properties

## Data Privacy

- PostHog is configured with `person_profiles: 'identified_only'` to only create user profiles for identified users
- No personal information is tracked in addresses - only metadata like length and presence of keywords
- All tracking respects user privacy and GDPR compliance

## Development

In development mode, PostHog will log successful initialization to the console. This helps verify the setup is working correctly.

## Production Considerations

- Ensure environment variables are properly set in your deployment platform
- Consider implementing user consent management if required by your privacy policy
- Monitor PostHog usage to stay within your plan limits
- Set up alerts for important conversion events

## Troubleshooting

### PostHog Not Loading

1. Check that `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. Verify the PostHog host URL is correct for your region
3. Check browser console for any JavaScript errors
4. Ensure the PostHog project is active and not paused

### Events Not Appearing

1. Check that events are being captured in development console
2. Verify PostHog dashboard is showing recent activity
3. Check that event names and properties are valid
4. Ensure user has not blocked analytics/tracking scripts

### Performance Issues

1. PostHog is loaded asynchronously and shouldn't block page rendering
2. Consider implementing user consent before initializing PostHog
3. Monitor bundle size impact of the PostHog library
import { Outlet } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { VibeStackBadge } from '@/components/vibestack-badge'
import { initializeOnboarding } from '@/services/onboarding'

/**
 * Main App component with routing
 * Uses React Router for SPA navigation
 * Initializes onboarding on first render to seed sample data
 */
function App() {
  useEffect(() => {
    // Initialize onboarding on app startup
    // This ensures sample tasks are seeded on first run
    const { seededSampleTasks } = initializeOnboarding()
    if (seededSampleTasks) {
      console.log('[App] Sample tasks seeded on first run')
    }
  }, [])

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <VibeStackBadge />
    </ErrorBoundary>
  )
}

export default App

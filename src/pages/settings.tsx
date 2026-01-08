/**
 * Settings Page
 * Allows users to manage application settings and reset data
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAllTasks,
  getAllTasks,
  saveTask,
} from '@/services/persistence'
import {
  resetOnboarding,
  getOnboardingState,
} from '@/services/onboarding'
import {
  getSampleTasksWithIds,
  getNonSampleTasks,
  getSampleTasksFromList,
} from '@/services/seed'

export function SettingsPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onboardingState = getOnboardingState()
  const currentTasks = getAllTasks()
  const sampleTasks = getSampleTasksFromList(currentTasks)
  const userTasks = getNonSampleTasks(currentTasks)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  /**
   * Reset to starter template
   * Keeps user tasks, replaces sample tasks with fresh ones
   */
  const handleResetStarterTemplate = async () => {
    if (
      !confirm(
        'This will replace the starter template tasks with fresh ones. Your custom tasks will be preserved. Continue?'
      )
    ) {
      return
    }

    setIsLoading(true)

    try {
      // Get user tasks (non-sample tasks)
      const userTasksData = userTasks

      // Clear all tasks
      clearAllTasks()

      // Re-seed sample tasks
      const freshSampleTasks = getSampleTasksWithIds()
      for (const sampleTask of freshSampleTasks) {
        saveTask({
          title: sampleTask.title,
          description: sampleTask.description,
          estimatedMinutes: sampleTask.estimatedMinutes,
          nextStep: sampleTask.nextStep,
          status: sampleTask.status,
          createdAt: sampleTask.createdAt,
          updatedAt: sampleTask.updatedAt,
        })
      }

      // Re-add user tasks
      for (const userTask of userTasksData) {
        saveTask({
          title: userTask.title,
          description: userTask.description,
          estimatedMinutes: userTask.estimatedMinutes,
          nextStep: userTask.nextStep,
          status: userTask.status,
          createdAt: userTask.createdAt,
          updatedAt: userTask.updatedAt,
        })
      }

      // Reset onboarding state
      resetOnboarding()

      showMessage(
        'success',
        'Starter template reset successfully! Your custom tasks are preserved.'
      )

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reset template'
      showMessage('error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clear all tasks (dangerous action)
   */
  const handleClearAllTasks = async () => {
    if (
      !confirm(
        'This will permanently delete ALL tasks (both custom and template). This cannot be undone. Are you sure?'
      )
    ) {
      return
    }

    if (!confirm('Really? This is irreversible.')) {
      return
    }

    setIsLoading(true)

    try {
      clearAllTasks()
      resetOnboarding()
      showMessage('success', 'All tasks cleared. Redirecting to dashboard...')

      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to clear tasks'
      showMessage('error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Remove only sample tasks
   */
  const handleRemoveSampleTasks = async () => {
    if (
      !confirm(
        'This will remove all starter template tasks. Your custom tasks will be preserved. Continue?'
      )
    ) {
      return
    }

    setIsLoading(true)

    try {
      // Keep only user tasks
      const userTasksData = userTasks
      clearAllTasks()

      // Re-add user tasks
      for (const userTask of userTasksData) {
        saveTask({
          title: userTask.title,
          description: userTask.description,
          estimatedMinutes: userTask.estimatedMinutes,
          nextStep: userTask.nextStep,
          status: userTask.status,
          createdAt: userTask.createdAt,
          updatedAt: userTask.updatedAt,
        })
      }

      showMessage(
        'success',
        'Starter template tasks removed. Your custom tasks are preserved.'
      )

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove template tasks'
      showMessage('error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your application preferences and data
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-6 rounded-md border p-4 ${
              message.type === 'success'
                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                message.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {message.type === 'success' ? '✓ ' : '✕ '}
              {message.text}
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
            Task Statistics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">
                {currentTasks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Custom Tasks
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userTasks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Starter Template
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
                {sampleTasks.length}
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding Status */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
            Onboarding Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed Onboarding
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  onboardingState.hasCompletedOnboarding
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                }`}
              >
                {onboardingState.hasCompletedOnboarding ? 'Yes' : 'No'}
              </span>
            </div>
            {onboardingState.onboardingCompletedAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Completed at:{' '}
                {new Date(
                  onboardingState.onboardingCompletedAt
                ).toLocaleDateString()}{' '}
                {new Date(
                  onboardingState.onboardingCompletedAt
                ).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Data Management
          </h2>

          {/* Reset Starter Template */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  Reset to Starter Template
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Replace the current starter template tasks with fresh ones.
                  Your custom tasks will be preserved.
                </p>
              </div>
              <button
                onClick={handleResetStarterTemplate}
                disabled={isLoading}
                className="rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/30"
              >
                {isLoading ? 'Processing...' : 'Reset Template'}
              </button>
            </div>
          </div>

          {/* Remove Sample Tasks */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  Remove Starter Template
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Remove all starter template tasks. Your custom tasks will be
                  preserved.
                </p>
              </div>
              <button
                onClick={handleRemoveSampleTasks}
                disabled={isLoading || sampleTasks.length === 0}
                className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200 dark:hover:bg-yellow-900/30"
              >
                {isLoading ? 'Processing...' : 'Remove Template'}
              </button>
            </div>
          </div>

          {/* Clear All Tasks */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">
                  Clear All Tasks
                </h3>
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  Permanently delete all tasks including custom tasks and the
                  starter template. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={handleClearAllTasks}
                disabled={isLoading || currentTasks.length === 0}
                className="rounded-md border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40"
              >
                {isLoading ? 'Processing...' : 'Clear All'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

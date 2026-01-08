/**
 * Create Task Page
 * Page for creating a new task using the TaskForm component
 */

import { useState } from 'react'
import { TaskForm } from '@/components/task-form'

export function CreateTaskPage() {
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleTaskSuccess = (taskId: string) => {
    setSuccessMessage(`Task created successfully! (ID: ${taskId})`)
    setErrorMessage('')

    // Clear success message after 5 seconds
    const timer = setTimeout(() => {
      setSuccessMessage('')
    }, 5000)

    return () => clearTimeout(timer)
  }

  const handleTaskError = (error: Error) => {
    setErrorMessage(error.message || 'Failed to create task')
    setSuccessMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">FocusSprint</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Create a task to get started with your focused work session
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✓ {successMessage}
            </p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">✕ {errorMessage}</p>
          </div>
        )}

        {/* Task Form */}
        <TaskForm onSuccess={handleTaskSuccess} onError={handleTaskError} />

        {/* Info Section */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Tips for better tasks:
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>✓ Be specific with your task title</li>
            <li>✓ Break complex work into smaller sessions</li>
            <li>✓ Define the first next step clearly</li>
            <li>✓ Choose a realistic time estimate</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

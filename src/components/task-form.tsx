/**
 * TaskForm Component
 * Compact form for creating tasks with title, description, estimated time, and next step
 */

import { useState } from 'react'
import type { FormErrors } from '@/types'
import { saveTask } from '@/services/persistence'

interface TaskFormProps {
  onSuccess?: (taskId: string) => void
  onError?: (error: Error) => void
}

const ESTIMATE_PRESETS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
]

export function TaskForm({ onSuccess, onError }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(15)
  const [usePreset, setUsePreset] = useState(true)
  const [nextStep, setNextStep] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (estimatedMinutes <= 0) {
      newErrors.estimatedMinutes = 'Estimated time must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const task = saveTask({
        title: title.trim(),
        description: description.trim(),
        estimatedMinutes,
        nextStep: nextStep.trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Reset form
      setTitle('')
      setDescription('')
      setEstimatedMinutes(15)
      setUsePreset(true)
      setNextStep('')
      setErrors({})

      onSuccess?.(task.id)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to create task')
      setErrors({ title: err.message })
      onError?.(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Design landing page mockup"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              if (errors.title) {
                setErrors({ ...errors, title: undefined })
              }
            }}
            disabled={isSubmitting}
            className={`mt-2 w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-50 ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Brief Description
          </label>
          <textarea
            id="description"
            placeholder="Add any additional context or details about this task"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          />
        </div>

        {/* Estimated Time Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Estimated Time <span className="text-red-500">*</span>
          </label>

          {usePreset ? (
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {ESTIMATE_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setEstimatedMinutes(preset.value)}
                    disabled={isSubmitting}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      estimatedMinutes === preset.value
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setUsePreset(false)}
                disabled={isSubmitting}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Custom minutes
              </button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                min="1"
                max="1440"
                value={estimatedMinutes}
                onChange={e => {
                  const value = parseInt(e.target.value, 10)
                  if (!isNaN(value)) {
                    setEstimatedMinutes(value)
                  }
                  if (errors.estimatedMinutes) {
                    setErrors({ ...errors, estimatedMinutes: undefined })
                  }
                }}
                disabled={isSubmitting}
                className={`w-24 rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-50 ${
                  errors.estimatedMinutes
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
                }`}
              />
              <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                minutes
              </span>
              <button
                type="button"
                onClick={() => setUsePreset(true)}
                disabled={isSubmitting}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Use presets
              </button>
            </div>
          )}
          {errors.estimatedMinutes && (
            <p className="mt-1 text-sm text-red-500">{errors.estimatedMinutes}</p>
          )}
        </div>

        {/* Next Step Field */}
        <div>
          <label
            htmlFor="nextStep"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            First Next Step
          </label>
          <input
            id="nextStep"
            type="text"
            placeholder="What's the first actionable step? e.g., Open Figma and create artboard"
            value={nextStep}
            onChange={e => setNextStep(e.target.value)}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isSubmitting ? 'Creating task...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle('')
              setDescription('')
              setEstimatedMinutes(15)
              setUsePreset(true)
              setNextStep('')
              setErrors({})
            }}
            disabled={isSubmitting}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

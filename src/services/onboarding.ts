/**
 * Onboarding service for managing first-run experience
 * Tracks onboarding state and manages sample task seeding
 */

import type { Task } from '@/types'
import { getAllTasks, saveTask } from './persistence'
import { getSampleTasksWithIds, hasSeededTasks } from './seed'

const ONBOARDING_KEY = 'focussprint:onboarding'

export interface OnboardingState {
  hasCompletedOnboarding: boolean
  onboardingCompletedAt: string | null
  sampleTasksCreated: boolean
}

/**
 * Get the current onboarding state
 */
export function getOnboardingState(): OnboardingState {
  try {
    const data = localStorage.getItem(ONBOARDING_KEY)
    return data
      ? JSON.parse(data)
      : {
          hasCompletedOnboarding: false,
          onboardingCompletedAt: null,
          sampleTasksCreated: false,
        }
  } catch (error) {
    console.error('Error reading onboarding state:', error)
    return {
      hasCompletedOnboarding: false,
      onboardingCompletedAt: null,
      sampleTasksCreated: false,
    }
  }
}

/**
 * Update onboarding state
 */
function updateOnboardingState(state: OnboardingState): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving onboarding state:', error)
    throw new Error('Failed to save onboarding state')
  }
}

/**
 * Check if this is the user's first visit (first-run)
 */
export function isFirstRun(): boolean {
  const state = getOnboardingState()
  return !state.hasCompletedOnboarding
}

/**
 * Initialize onboarding - creates sample tasks if this is first run
 * Should be called once on app initialization (e.g., in App.tsx or main layout)
 */
export function initializeOnboarding(): { seededSampleTasks: boolean } {
  const state = getOnboardingState()

  // If already completed onboarding and sample tasks were created, nothing to do
  if (state.hasCompletedOnboarding && state.sampleTasksCreated) {
    return { seededSampleTasks: false }
  }

  // Check if we already have seeded tasks in localStorage
  const existingTasks = getAllTasks()
  const hasExistingSeeds = hasSeededTasks(existingTasks)

  // If this is first run AND no seeded tasks exist yet, create them
  if (!state.hasCompletedOnboarding && !hasExistingSeeds) {
    try {
      const sampleTasks = getSampleTasksWithIds()

      // Save each sample task to localStorage
      for (const sampleTask of sampleTasks) {
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

      // Mark onboarding as complete and sample tasks as created
      updateOnboardingState({
        hasCompletedOnboarding: true,
        onboardingCompletedAt: new Date().toISOString(),
        sampleTasksCreated: true,
      })

      return { seededSampleTasks: true }
    } catch (error) {
      console.error('Error seeding sample tasks:', error)
      return { seededSampleTasks: false }
    }
  }

  // Onboarding already happened, return false
  return { seededSampleTasks: false }
}

/**
 * Complete onboarding manually (called when user finishes tour or skips it)
 */
export function completeOnboarding(): void {
  const state = getOnboardingState()
  updateOnboardingState({
    ...state,
    hasCompletedOnboarding: true,
    onboardingCompletedAt: new Date().toISOString(),
  })
}

/**
 * Reset onboarding to allow seeding sample tasks again
 * Used when user clicks "Reset to starter template"
 */
export function resetOnboarding(): void {
  updateOnboardingState({
    hasCompletedOnboarding: false,
    onboardingCompletedAt: null,
    sampleTasksCreated: false,
  })
}

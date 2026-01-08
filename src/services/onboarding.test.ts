/**
 * Tests for onboarding service
 * Validates that onboarding state and seeding works correctly
 */

import {
  getOnboardingState,
  isFirstRun,
  initializeOnboarding,
  completeOnboarding,
  resetOnboarding,
} from './onboarding'
import { getAllTasks, clearAllTasks } from './persistence'

describe('Onboarding Service', () => {
  beforeEach(() => {
    // Clear localStorage and tasks before each test
    localStorage.clear()
    clearAllTasks()
  })

  describe('getOnboardingState', () => {
    it('should return default state on first run', () => {
      const state = getOnboardingState()
      expect(state).toEqual({
        hasCompletedOnboarding: false,
        onboardingCompletedAt: null,
        sampleTasksCreated: false,
      })
    })
  })

  describe('isFirstRun', () => {
    it('should return true if onboarding not completed', () => {
      expect(isFirstRun()).toBe(true)
    })

    it('should return false after onboarding is completed', () => {
      completeOnboarding()
      expect(isFirstRun()).toBe(false)
    })
  })

  describe('initializeOnboarding', () => {
    it('should seed sample tasks on first run', () => {
      const result = initializeOnboarding()
      expect(result.seededSampleTasks).toBe(true)

      const tasks = getAllTasks()
      expect(tasks.length).toBeGreaterThan(0)

      // Check that sample tasks were created
      const sampleTaskIds = tasks.filter(t => t.id.startsWith('sample_'))
      expect(sampleTaskIds.length).toBeGreaterThan(0)
    })

    it('should mark onboarding as completed', () => {
      initializeOnboarding()

      const state = getOnboardingState()
      expect(state.hasCompletedOnboarding).toBe(true)
      expect(state.sampleTasksCreated).toBe(true)
    })

    it('should not seed tasks if already completed', () => {
      initializeOnboarding()
      const tasksAfterInit = getAllTasks()

      const result = initializeOnboarding()
      expect(result.seededSampleTasks).toBe(false)

      const tasksAfterSecondInit = getAllTasks()
      expect(tasksAfterInit).toEqual(tasksAfterSecondInit)
    })

    it('should create exactly 3 sample tasks', () => {
      initializeOnboarding()
      const tasks = getAllTasks()
      const sampleTasks = tasks.filter(t => t.id.startsWith('sample_'))
      expect(sampleTasks).toHaveLength(3)
    })
  })

  describe('completeOnboarding', () => {
    it('should mark onboarding as complete', () => {
      completeOnboarding()
      const state = getOnboardingState()
      expect(state.hasCompletedOnboarding).toBe(true)
      expect(state.onboardingCompletedAt).not.toBeNull()
    })

    it('should set onboardingCompletedAt timestamp', () => {
      const beforeTime = Date.now()
      completeOnboarding()
      const afterTime = Date.now()

      const state = getOnboardingState()
      expect(state.onboardingCompletedAt).not.toBeNull()

      const timestamp = new Date(state.onboardingCompletedAt!).getTime()
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(timestamp).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('resetOnboarding', () => {
    it('should reset onboarding state', () => {
      initializeOnboarding()
      completeOnboarding()

      expect(isFirstRun()).toBe(false)

      resetOnboarding()

      const state = getOnboardingState()
      expect(state.hasCompletedOnboarding).toBe(false)
      expect(state.onboardingCompletedAt).toBeNull()
      expect(state.sampleTasksCreated).toBe(false)
      expect(isFirstRun()).toBe(true)
    })

    it('should allow re-seeding after reset', () => {
      initializeOnboarding()
      const initialTasks = getAllTasks()

      resetOnboarding()
      const result = initializeOnboarding()

      expect(result.seededSampleTasks).toBe(true)
      const newTasks = getAllTasks()

      // Should have seeded again (but with different IDs)
      expect(newTasks.length).toBeGreaterThanOrEqual(initialTasks.length)
    })
  })

  describe('Integration: Full onboarding flow', () => {
    it('should complete full onboarding flow', () => {
      // Start: First run
      expect(isFirstRun()).toBe(true)

      // Initialize
      const initResult = initializeOnboarding()
      expect(initResult.seededSampleTasks).toBe(true)

      // Check state
      const state = getOnboardingState()
      expect(state.hasCompletedOnboarding).toBe(true)
      expect(state.sampleTasksCreated).toBe(true)

      // Check tasks
      const tasks = getAllTasks()
      expect(tasks.length).toBe(3)

      // All should be sample tasks
      const allAreSample = tasks.every(t => t.id.startsWith('sample_'))
      expect(allAreSample).toBe(true)

      // Complete onboarding
      completeOnboarding()
      expect(isFirstRun()).toBe(false)

      // Reset
      resetOnboarding()
      expect(isFirstRun()).toBe(true)

      // Re-initialize
      const reInitResult = initializeOnboarding()
      expect(reInitResult.seededSampleTasks).toBe(true)
    })
  })
})

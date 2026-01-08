/**
 * Integration tests for sample data seeding and dashboard integration
 * Validates the complete flow: onboarding -> seeding -> dashboard display -> reset
 */

import {
  getOnboardingState,
  initializeOnboarding,
  reseedStarterTemplate,
  resetOnboarding,
} from './onboarding'
import { getAllTasks, clearAllTasks, saveTask } from './persistence'
import {
  getSampleTasksFromList,
  getNonSampleTasks,
  hasSeededTasks,
  SAMPLE_TASKS,
} from './seed'

describe('Integration Tests: Seeding and Dashboard', () => {
  beforeEach(() => {
    // Clear localStorage and tasks before each test
    localStorage.clear()
    clearAllTasks()
  })

  describe('First-run seeding and dashboard display', () => {
    it('should seed sample data on first app load', () => {
      // Simulate first app run - onboarding not completed yet
      expect(getOnboardingState().hasCompletedOnboarding).toBe(false)

      // Initialize (simulating App.tsx useEffect)
      const result = initializeOnboarding()
      expect(result.seededSampleTasks).toBe(true)

      // Verify sample tasks exist in localStorage (dashboard should see them)
      const allTasks = getAllTasks()
      expect(allTasks.length).toBeGreaterThan(0)

      // Dashboard filtering should work - can access sample tasks
      const sampleTasks = getSampleTasksFromList(allTasks)
      expect(sampleTasks.length).toBe(SAMPLE_TASKS.length)

      // Dashboard filtering should work - can access user tasks (none yet)
      const userTasks = getNonSampleTasks(allTasks)
      expect(userTasks.length).toBe(0)
    })

    it('should display correct metrics on dashboard after seeding', () => {
      // First run
      initializeOnboarding()
      const tasks = getAllTasks()

      // Dashboard metrics calculations
      const totalCount = tasks.length
      const completedCount = tasks.filter(t => t.status === 'completed').length
      const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
      const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)

      // Verify metrics
      expect(totalCount).toBe(SAMPLE_TASKS.length)
      expect(completedCount).toBe(0) // No completed tasks initially
      expect(inProgressCount).toBe(0) // No in-progress tasks initially
      expect(totalMinutes).toBeGreaterThan(0) // Should have estimated time

      // Sample tasks should be identifiable
      const sampleTasks = getSampleTasksFromList(tasks)
      expect(sampleTasks.length).toBe(SAMPLE_TASKS.length)
      expect(sampleTasks.every(t => t.status === 'new')).toBe(true)
    })

    it('should preserve seeded data across page reloads', () => {
      // First visit
      initializeOnboarding()
      const tasksAfterInit = getAllTasks()
      const sampleTaskIds = tasksAfterInit
        .filter(t => t.id.startsWith('sample_'))
        .map(t => t.id)

      // Simulate page reload (clear memory, but keep localStorage)
      const onboardingState = getOnboardingState()
      expect(onboardingState.hasCompletedOnboarding).toBe(true)

      // Second visit (same as before, but not a first run)
      const result = initializeOnboarding()
      expect(result.seededSampleTasks).toBe(false) // Already seeded

      const tasksAfterReload = getAllTasks()
      const reloadedSampleTaskIds = tasksAfterReload
        .filter(t => t.id.startsWith('sample_'))
        .map(t => t.id)

      // Sample task IDs should be the same
      expect(reloadedSampleTaskIds).toEqual(sampleTaskIds)
    })
  })

  describe('Dashboard with mixed tasks', () => {
    it('should display both seeded and user-created tasks on dashboard', () => {
      // Seed sample tasks
      initializeOnboarding()

      // Add some user tasks
      saveTask({
        title: 'My Custom Task 1',
        description: 'A user-created task',
        estimatedMinutes: 20,
        nextStep: 'Start working',
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      saveTask({
        title: 'My Custom Task 2',
        description: 'Another user task',
        estimatedMinutes: 30,
        nextStep: 'Continue',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const allTasks = getAllTasks()
      const sampleTasks = getSampleTasksFromList(allTasks)
      const userTasks = getNonSampleTasks(allTasks)

      // Dashboard should see all tasks
      expect(allTasks.length).toBe(SAMPLE_TASKS.length + 2)

      // Dashboard filter for sample tasks
      expect(sampleTasks.length).toBe(SAMPLE_TASKS.length)

      // Dashboard filter for user tasks
      expect(userTasks.length).toBe(2)

      // All tasks should be in the combined list
      const combined = [...sampleTasks, ...userTasks]
      expect(combined.length).toBe(allTasks.length)
    })

    it('should calculate correct metrics with mixed tasks', () => {
      // Seed
      initializeOnboarding()

      // Add user tasks with different statuses
      saveTask({
        title: 'Completed User Task',
        description: 'Done',
        estimatedMinutes: 30,
        nextStep: '',
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      saveTask({
        title: 'In Progress User Task',
        description: 'Working',
        estimatedMinutes: 45,
        nextStep: '',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const tasks = getAllTasks()
      const completedCount = tasks.filter(t => t.status === 'completed').length
      const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
      const completedMinutes = tasks
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.estimatedMinutes, 0)

      expect(completedCount).toBe(1)
      expect(inProgressCount).toBe(1)
      expect(completedMinutes).toBe(30)
    })
  })

  describe('Reset to starter template', () => {
    it('should reseed sample tasks while preserving user tasks', () => {
      // Initial seed
      initializeOnboarding()

      // Add user task
      const userTask = saveTask({
        title: 'My Important Task',
        description: 'This should be preserved',
        estimatedMinutes: 60,
        nextStep: 'Do it',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Get initial sample task IDs
      const tasksBefore = getAllTasks()
      const sampleIdsBefore = getSampleTasksFromList(tasksBefore).map(t => t.id)

      // Reset starter template
      const result = reseedStarterTemplate()
      expect(result.success).toBe(true)
      expect(result.seededCount).toBe(SAMPLE_TASKS.length)

      // Check results
      const tasksAfter = getAllTasks()
      const samplesAfter = getSampleTasksFromList(tasksAfter)
      const usersAfter = getNonSampleTasks(tasksAfter)

      // Should have same number of sample tasks
      expect(samplesAfter.length).toBe(SAMPLE_TASKS.length)

      // Should have same user task
      expect(usersAfter.length).toBe(1)
      expect(usersAfter[0].title).toBe('My Important Task')
      expect(usersAfter[0].id).toBe(userTask.id)

      // Sample task IDs should be different (fresh seeds)
      const sampleIdsAfter = samplesAfter.map(t => t.id)
      expect(sampleIdsAfter).not.toEqual(sampleIdsBefore)
    })

    it('should work correctly with multiple user tasks', () => {
      // Seed
      initializeOnboarding()

      // Add multiple user tasks
      const task1 = saveTask({
        title: 'User Task 1',
        description: '',
        estimatedMinutes: 20,
        nextStep: '',
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const task2 = saveTask({
        title: 'User Task 2',
        description: '',
        estimatedMinutes: 30,
        nextStep: '',
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      const task3 = saveTask({
        title: 'User Task 3',
        description: '',
        estimatedMinutes: 45,
        nextStep: '',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Reset
      const result = reseedStarterTemplate()
      expect(result.success).toBe(true)

      // Verify all user tasks preserved
      const tasksAfter = getAllTasks()
      const usersAfter = getNonSampleTasks(tasksAfter)

      expect(usersAfter.length).toBe(3)
      const userIds = usersAfter.map(t => t.id)
      expect(userIds).toContain(task1.id)
      expect(userIds).toContain(task2.id)
      expect(userIds).toContain(task3.id)

      // All should have their original data
      const foundTask2 = usersAfter.find(t => t.id === task2.id)
      expect(foundTask2?.status).toBe('completed')
      expect(foundTask2?.estimatedMinutes).toBe(30)
    })

    it('should update onboarding state after reseed', () => {
      // Seed
      initializeOnboarding()

      // Change onboarding state
      resetOnboarding()
      expect(getOnboardingState().sampleTasksCreated).toBe(false)

      // Reset template
      reseedStarterTemplate()

      // State should be updated
      const state = getOnboardingState()
      expect(state.sampleTasksCreated).toBe(true)
    })

    it('should handle reseed with no user tasks', () => {
      // Seed only
      initializeOnboarding()

      const tasksBefore = getAllTasks()
      const initialCount = tasksBefore.length

      // Reset
      const result = reseedStarterTemplate()
      expect(result.success).toBe(true)

      // Should still have same number of tasks
      const tasksAfter = getAllTasks()
      expect(tasksAfter.length).toBe(initialCount)

      // All should be sample tasks
      const samples = getSampleTasksFromList(tasksAfter)
      expect(samples.length).toBe(initialCount)
    })
  })

  describe('Full user journey: onboarding -> use -> reset -> use again', () => {
    it('should handle complete workflow correctly', () => {
      // 1. First visit - app initializes
      expect(getOnboardingState().hasCompletedOnboarding).toBe(false)
      const initResult = initializeOnboarding()
      expect(initResult.seededSampleTasks).toBe(true)

      // 2. User sees dashboard with sample tasks
      let tasks = getAllTasks()
      expect(getSampleTasksFromList(tasks).length).toBe(SAMPLE_TASKS.length)
      expect(getNonSampleTasks(tasks).length).toBe(0)

      // 3. User creates a task
      const userTask = saveTask({
        title: 'Important Work',
        description: 'My task',
        estimatedMinutes: 120,
        nextStep: 'Start',
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // 4. User works with tasks
      tasks = getAllTasks()
      expect(tasks.length).toBe(SAMPLE_TASKS.length + 1)

      // 5. User decides to reset starter template in settings
      const resetResult = reseedStarterTemplate()
      expect(resetResult.success).toBe(true)

      // 6. Dashboard should show fresh samples + user's task
      tasks = getAllTasks()
      const samples = getSampleTasksFromList(tasks)
      const users = getNonSampleTasks(tasks)

      expect(samples.length).toBe(SAMPLE_TASKS.length)
      expect(users.length).toBe(1)
      expect(users[0].id).toBe(userTask.id)
      expect(users[0].title).toBe('Important Work')

      // 7. User can continue working with fresh sample tasks
      expect(hasSeededTasks(samples)).toBe(true)
      expect(samples.every(t => t.status === 'new')).toBe(true)
    })
  })
})

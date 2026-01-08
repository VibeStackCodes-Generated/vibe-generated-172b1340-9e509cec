/**
 * Tests for seed service
 * Validates that sample tasks are created correctly and identifiable
 */

import {
  SAMPLE_TASKS,
  getSampleTasksWithIds,
  hasSeededTasks,
  getNonSampleTasks,
  getSampleTasksFromList,
} from './seed'
import type { Task } from '@/types'

describe('Seed Service', () => {
  describe('SAMPLE_TASKS', () => {
    it('should have exactly 3 sample tasks', () => {
      expect(SAMPLE_TASKS).toHaveLength(3)
    })

    it('should have all required fields in each sample task', () => {
      SAMPLE_TASKS.forEach(task => {
        expect(task).toHaveProperty('title')
        expect(task).toHaveProperty('description')
        expect(task).toHaveProperty('estimatedMinutes')
        expect(task).toHaveProperty('nextStep')
        expect(task).toHaveProperty('status')
        expect(task).toHaveProperty('createdAt')
        expect(task).toHaveProperty('updatedAt')
      })
    })

    it('should have valid status for all sample tasks', () => {
      const validStatuses = ['new', 'in-progress', 'completed', 'partial', 'deferred']
      SAMPLE_TASKS.forEach(task => {
        expect(validStatuses).toContain(task.status)
      })
    })
  })

  describe('getSampleTasksWithIds', () => {
    it('should return tasks with IDs', () => {
      const tasksWithIds = getSampleTasksWithIds()
      expect(tasksWithIds).toHaveLength(3)
      tasksWithIds.forEach(task => {
        expect(task.id).toBeDefined()
        expect(typeof task.id).toBe('string')
      })
    })

    it('should generate unique IDs', () => {
      const tasksWithIds1 = getSampleTasksWithIds()
      const tasksWithIds2 = getSampleTasksWithIds()

      const ids1 = tasksWithIds1.map(t => t.id)
      const ids2 = tasksWithIds2.map(t => t.id)

      // All IDs should be different since they use timestamps
      const uniqueIds = new Set([...ids1, ...ids2])
      expect(uniqueIds.size).toBe(6)
    })

    it('should prefix IDs with "sample_"', () => {
      const tasksWithIds = getSampleTasksWithIds()
      tasksWithIds.forEach(task => {
        expect(task.id).toMatch(/^sample_/)
      })
    })
  })

  describe('hasSeededTasks', () => {
    it('should return true when sample tasks are present', () => {
      const tasks: Task[] = [
        {
          id: 'sample_123',
          title: 'Test',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      expect(hasSeededTasks(tasks)).toBe(true)
    })

    it('should return false when only user tasks are present', () => {
      const tasks: Task[] = [
        {
          id: 'task_123',
          title: 'Test',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      expect(hasSeededTasks(tasks)).toBe(false)
    })

    it('should return false when no tasks are present', () => {
      expect(hasSeededTasks([])).toBe(false)
    })
  })

  describe('getNonSampleTasks', () => {
    it('should filter out sample tasks', () => {
      const tasks: Task[] = [
        {
          id: 'sample_123',
          title: 'Sample',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'task_456',
          title: 'User Task',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      const nonSample = getNonSampleTasks(tasks)
      expect(nonSample).toHaveLength(1)
      expect(nonSample[0].id).toBe('task_456')
    })
  })

  describe('getSampleTasksFromList', () => {
    it('should return only sample tasks', () => {
      const tasks: Task[] = [
        {
          id: 'sample_123',
          title: 'Sample',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'task_456',
          title: 'User Task',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample_789',
          title: 'Another Sample',
          description: '',
          estimatedMinutes: 30,
          nextStep: '',
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      const samples = getSampleTasksFromList(tasks)
      expect(samples).toHaveLength(2)
      expect(samples[0].id).toBe('sample_123')
      expect(samples[1].id).toBe('sample_789')
    })
  })
})

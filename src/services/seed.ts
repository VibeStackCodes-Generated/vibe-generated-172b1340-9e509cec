/**
 * Seed service for providing sample/starter template tasks
 * Provides sample tasks and manages seeding functionality
 */

import type { Task } from '@/types'

/**
 * Sample tasks for onboarding - these are the starter template
 */
export const SAMPLE_TASKS: Omit<Task, 'id'>[] = [
  {
    title: 'Design landing page mockup',
    description:
      'Create initial wireframes and visual design for the main landing page. Focus on clear value proposition and CTA placement.',
    estimatedMinutes: 45,
    nextStep: 'Open Figma and create a new design file with the brand colors',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Review project requirements',
    description:
      'Go through the PRD and acceptance criteria to understand the full scope of work. Take notes on any blockers or clarifications needed.',
    estimatedMinutes: 30,
    nextStep: 'Read through the entire PRD document and create a summary',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Set up development environment',
    description:
      'Install all necessary dependencies and configure local development setup. Verify that the application builds and runs correctly.',
    estimatedMinutes: 20,
    nextStep: 'Run npm install and npm run dev to start the dev server',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Generate unique IDs for sample tasks
 * Creates IDs that don't conflict with existing tasks
 */
function generateSampleTaskId(): string {
  return `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get sample tasks with generated IDs
 * Each call generates new IDs to ensure uniqueness
 */
export function getSampleTasksWithIds(): Task[] {
  return SAMPLE_TASKS.map(task => ({
    ...task,
    id: generateSampleTaskId(),
  }))
}

/**
 * Check if tasks are seeded (have sample data)
 * Sample tasks are identifiable by having 'sample_' prefix in their ID
 */
export function hasSeededTasks(tasks: Task[]): boolean {
  return tasks.some(task => task.id.startsWith('sample_'))
}

/**
 * Get only non-sample tasks (user-created tasks)
 */
export function getNonSampleTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => !task.id.startsWith('sample_'))
}

/**
 * Get only sample tasks
 */
export function getSampleTasksFromList(tasks: Task[]): Task[] {
  return tasks.filter(task => task.id.startsWith('sample_'))
}

/**
 * Reseed sample tasks - removes old sample tasks and creates new ones
 * Used when user clicks "Reset to starter template" in settings
 * Requires persistence module to be imported separately to avoid circular deps
 */
export function reseedSampleTasks(
  getAllTasksFn: () => Task[],
  saveTaskFn: (task: Omit<Task, 'id'>) => Task,
  deleteTaskFn: (id: string) => boolean
): Task[] {
  const allTasks = getAllTasksFn()

  // Get user-created tasks (non-sample)
  const userTasks = getNonSampleTasks(allTasks)

  // Remove all existing sample tasks
  const sampleTasks = getSampleTasksFromList(allTasks)
  for (const sampleTask of sampleTasks) {
    deleteTaskFn(sampleTask.id)
  }

  // Create fresh sample tasks
  const freshSampleTasks = getSampleTasksWithIds()
  const seededTasks: Task[] = []

  for (const sampleTask of freshSampleTasks) {
    const saved = saveTaskFn({
      title: sampleTask.title,
      description: sampleTask.description,
      estimatedMinutes: sampleTask.estimatedMinutes,
      nextStep: sampleTask.nextStep,
      status: sampleTask.status,
      createdAt: sampleTask.createdAt,
      updatedAt: sampleTask.updatedAt,
    })
    seededTasks.push(saved)
  }

  return seededTasks
}

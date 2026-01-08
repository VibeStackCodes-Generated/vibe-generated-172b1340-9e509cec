/**
 * Example usage and tests for the persistence service
 * This demonstrates how to use the localStorage persistence API
 */

import {
  getAllTasks,
  getTaskById,
  saveTask,
  updateTask,
  deleteTask,
  clearAllTasks,
} from './persistence'

/**
 * Example: Create a new task
 */
export function exampleCreateTask() {
  const task = saveTask({
    title: 'Design landing page mockup',
    description: 'Create a mockup for the new landing page design',
    estimatedMinutes: 30,
    nextStep: 'Open Figma and create a new file',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  console.log('Created task:', task)
  return task.id
}

/**
 * Example: Get all tasks
 */
export function exampleGetAllTasks() {
  const tasks = getAllTasks()
  console.log('All tasks:', tasks)
  return tasks
}

/**
 * Example: Get a specific task by ID
 */
export function exampleGetTaskById(taskId: string) {
  const task = getTaskById(taskId)
  console.log('Task with ID', taskId, ':', task)
  return task
}

/**
 * Example: Update a task
 */
export function exampleUpdateTask(taskId: string) {
  const updated = updateTask(taskId, {
    status: 'in-progress',
    updatedAt: new Date().toISOString(),
  })

  console.log('Updated task:', updated)
  return updated
}

/**
 * Example: Delete a task
 */
export function exampleDeleteTask(taskId: string) {
  const deleted = deleteTask(taskId)
  console.log('Task deleted:', deleted)
  return deleted
}

/**
 * Example: Clear all tasks (use with caution!)
 */
export function exampleClearAllTasks() {
  clearAllTasks()
  console.log('All tasks cleared')
}

/**
 * Full example workflow
 */
export function exampleCompleteWorkflow() {
  console.log('=== Task Persistence Service Example ===\n')

  // 1. Create a task
  console.log('1. Creating a new task...')
  const taskId = exampleCreateTask()

  // 2. Get all tasks
  console.log('\n2. Fetching all tasks...')
  exampleGetAllTasks()

  // 3. Get specific task
  console.log('\n3. Getting specific task...')
  exampleGetTaskById(taskId)

  // 4. Update task
  console.log('\n4. Updating task status to in-progress...')
  exampleUpdateTask(taskId)

  // 5. Get all tasks again
  console.log('\n5. Fetching all tasks again...')
  exampleGetAllTasks()

  // 6. Delete task
  console.log('\n6. Deleting the task...')
  exampleDeleteTask(taskId)

  // 7. Get all tasks final
  console.log('\n7. Final list of all tasks...')
  exampleGetAllTasks()
}

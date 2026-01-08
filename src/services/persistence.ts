/**
 * Persistence service for localStorage management
 * Handles saving and retrieving tasks from localStorage
 */

import type { Task } from '@/types'

const STORAGE_KEY = 'focussprint:tasks'

/**
 * Get all tasks from localStorage
 */
export function getAllTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error)
    return []
  }
}

/**
 * Get a single task by ID
 */
export function getTaskById(id: string): Task | null {
  const tasks = getAllTasks()
  return tasks.find(task => task.id === id) || null
}

/**
 * Save a new task to localStorage
 */
export function saveTask(task: Omit<Task, 'id'>): Task {
  const id = generateId()
  const newTask: Task = {
    ...task,
    id,
  }

  const tasks = getAllTasks()
  tasks.push(newTask)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return newTask
  } catch (error) {
    console.error('Error saving task to localStorage:', error)
    throw new Error('Failed to save task')
  }
}

/**
 * Update an existing task
 */
export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getAllTasks()
  const taskIndex = tasks.findIndex(task => task.id === id)

  if (taskIndex === -1) {
    return null
  }

  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...updates,
    id: tasks[taskIndex].id,
    createdAt: tasks[taskIndex].createdAt,
  }

  tasks[taskIndex] = updatedTask

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return updatedTask
  } catch (error) {
    console.error('Error updating task in localStorage:', error)
    throw new Error('Failed to update task')
  }
}

/**
 * Delete a task by ID
 */
export function deleteTask(id: string): boolean {
  const tasks = getAllTasks()
  const filtered = tasks.filter(task => task.id !== id)

  if (filtered.length === tasks.length) {
    return false
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting task from localStorage:', error)
    throw new Error('Failed to delete task')
  }
}

/**
 * Clear all tasks from localStorage
 */
export function clearAllTasks(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing tasks from localStorage:', error)
    throw new Error('Failed to clear tasks')
  }
}

/**
 * Generate a unique ID for a new task
 */
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Type definitions for FocusSprint application
 */

export interface Task {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  nextStep: string
  status: 'new' | 'in-progress' | 'completed' | 'partial' | 'deferred'
  createdAt: string
  updatedAt: string
}

export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>

export interface FormErrors {
  title?: string
  estimatedMinutes?: string
}

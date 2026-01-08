/**
 * Dashboard Page
 * Displays all tasks, metrics, and allows task management
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '@/types'
import { getAllTasks, updateTask, deleteTask } from '@/services/persistence'
import { getSampleTasksFromList, getNonSampleTasks } from '@/services/seed'

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'sample' | 'user'>('all')
  const [loading, setLoading] = useState(true)

  // Load tasks on mount and set up polling
  useEffect(() => {
    const loadTasks = () => {
      setTasks(getAllTasks())
      setLoading(false)
    }

    loadTasks()

    // Poll for changes every second to stay in sync
    const interval = setInterval(loadTasks, 1000)
    return () => clearInterval(interval)
  }, [])

  // Filter tasks based on current filter
  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'sample':
        return getSampleTasksFromList(tasks)
      case 'user':
        return getNonSampleTasks(tasks)
      default:
        return tasks
    }
  }

  // Calculate metrics
  const allTasks = tasks
  const completedCount = allTasks.filter(t => t.status === 'completed').length
  const inProgressCount = allTasks.filter(t => t.status === 'in-progress').length
  const totalMinutes = allTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)
  const completedMinutes = allTasks
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.estimatedMinutes, 0)

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus })
    setTasks(getAllTasks())
  }

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
      setTasks(getAllTasks())
    }
  }

  const filteredTasks = getFilteredTasks()

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
      case 'deferred':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your tasks and track progress
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/create"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              New Task
            </Link>
            <Link
              to="/settings"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
              {allTasks.length}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {completedCount}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              In Progress
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {inProgressCount}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Time Saved
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
              {completedMinutes}m
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            All Tasks ({allTasks.length})
          </button>
          <button
            onClick={() => setFilter('sample')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'sample'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Starter Template ({getSampleTasksFromList(allTasks).length})
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'user'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            My Tasks ({getNonSampleTasks(allTasks).length})
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' && 'No tasks yet. Create one to get started!'}
                {filter === 'sample' && 'No starter template tasks.'}
                {filter === 'user' && 'No custom tasks yet. Create one to get started!'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        {task.title}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>⏱ {task.estimatedMinutes} min</span>
                      {task.nextStep && <span>→ {task.nextStep}</span>}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex flex-col gap-2">
                    <select
                      value={task.status}
                      onChange={e =>
                        handleStatusChange(
                          task.id,
                          e.target.value as Task['status']
                        )
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="partial">Partial</option>
                      <option value="deferred">Deferred</option>
                    </select>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

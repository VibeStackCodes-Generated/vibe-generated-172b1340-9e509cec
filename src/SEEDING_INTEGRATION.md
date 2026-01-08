# Seeding and Onboarding Integration

## Overview

This document describes how the sample data seeding and onboarding integration works in FocusSprint.

## Architecture

### Services

#### 1. **Seed Service** (`src/services/seed.ts`)
- Defines `SAMPLE_TASKS`: An array of 3 pre-configured sample tasks for onboarding
- `getSampleTasksWithIds()`: Generates sample tasks with unique IDs (prefixed with `sample_`)
- `hasSeededTasks()`: Checks if a task list contains any seeded sample tasks
- `getSampleTasksFromList()`: Filters and returns only sample tasks from a list
- `getNonSampleTasks()`: Filters and returns only user-created tasks (non-sample)

#### 2. **Onboarding Service** (`src/services/onboarding.ts`)
- Manages onboarding state in localStorage (`focussprint:onboarding`)
- `initializeOnboarding()`: Core function that:
  - Checks if this is the first run
  - Creates sample tasks if not already seeded
  - Marks onboarding as complete
  - Returns whether seeding occurred
- `isFirstRun()`: Checks if user is on first visit
- `completeOnboarding()`: Manually mark onboarding complete
- `resetOnboarding()`: Reset onboarding state to allow re-seeding

#### 3. **Persistence Service** (`src/services/persistence.ts`)
- Handles all localStorage operations for tasks
- `saveTask()`: Saves a task to localStorage
- `getAllTasks()`: Retrieves all tasks
- `updateTask()`: Updates task status and properties
- `deleteTask()`: Removes a specific task
- `clearAllTasks()`: Clears all tasks (used for reset)

## Flow

### First Visit (Onboarding)

1. User visits the application
2. Home page loads and calls `initializeOnboarding()`
3. Service checks localStorage for onboarding state
4. If first run (no previous state):
   - Creates 3 sample tasks via `getSampleTasksWithIds()`
   - Saves each sample task to localStorage
   - Updates onboarding state to mark completion
5. User can view dashboard with seeded sample tasks
6. User can interact with, modify, or delete sample tasks
7. User can create their own custom tasks alongside samples

### Sample Task Identification

Sample tasks are identified by their ID prefix:
- **Sample Task ID**: `sample_[timestamp]_[random]` (e.g., `sample_1704814800000_abc123def`)
- **User Task ID**: `task_[timestamp]_[random]` (e.g., `task_1704814860000_xyz789uvw`)

### Dashboard Display

The dashboard has filter tabs:
- **All Tasks**: Shows both sample and user-created tasks
- **Starter Template**: Shows only sample tasks (IDs start with `sample_`)
- **My Tasks**: Shows only user-created tasks (IDs start with `task_`)

### Reset to Starter Template (Settings Page)

When user clicks "Reset to Starter Template" in settings:

1. Confirmation dialog appears
2. System identifies current tasks:
   - Extracts all user-created tasks (non-sample)
   - Identifies existing sample tasks
3. Process:
   - Clears all tasks from localStorage
   - Creates fresh sample tasks with new IDs
   - Re-adds all preserved user tasks
   - Resets onboarding state to allow one more re-seed
4. Redirects to dashboard showing reset tasks

### Remove Sample Tasks

When user clicks "Remove Starter Template" in settings:

1. Confirmation dialog appears
2. System:
   - Preserves all user-created tasks
   - Deletes all sample tasks
   - Does not reset onboarding state
3. Dashboard shows only custom tasks

### Clear All Tasks

When user clicks "Clear All Tasks" in settings:

1. Double confirmation dialog appears
2. System:
   - Clears all tasks (sample + user)
   - Resets onboarding state
   - Allows fresh start next visit
3. Redirects to dashboard (empty state)

## Data Structure

### Sample Tasks (Default)

1. **Design Landing Page Mockup**
   - Estimated: 45 minutes
   - Description: Create initial wireframes and visual design
   - Next Step: Open Figma and create a new design file

2. **Review Project Requirements**
   - Estimated: 30 minutes
   - Description: Go through PRD and acceptance criteria
   - Next Step: Read through entire PRD document

3. **Set Up Development Environment**
   - Estimated: 20 minutes
   - Description: Install dependencies and configure dev setup
   - Next Step: Run npm install and npm run dev

## LocalStorage Keys

- **Tasks**: `focussprint:tasks` - Array of all Task objects
- **Onboarding State**: `focussprint:onboarding` - OnboardingState object

## State Interfaces

```typescript
// OnboardingState
{
  hasCompletedOnboarding: boolean    // Whether onboarding has completed
  onboardingCompletedAt: string|null // ISO timestamp of completion
  sampleTasksCreated: boolean        // Whether sample tasks were created
}

// Task
{
  id: string                     // Unique ID (sample_* or task_*)
  title: string                  // Task title
  description: string            // Task description
  estimatedMinutes: number       // Time estimate in minutes
  nextStep: string               // First actionable step
  status: 'new'|'in-progress'|'completed'|'partial'|'deferred'
  createdAt: string              // ISO timestamp
  updatedAt: string              // ISO timestamp
}
```

## Testing

### Test Files
- `src/services/seed.test.ts`: Tests for seed service
- `src/services/onboarding.test.ts`: Tests for onboarding service

### Key Test Scenarios
1. Sample tasks have correct properties
2. Seeded tasks have unique IDs
3. Onboarding state persists correctly
4. First run creates sample tasks
5. Subsequent runs don't re-create samples
6. Reset allows re-seeding
7. User tasks are preserved during reset
8. Filters correctly identify sample vs user tasks

## Integration Points

### App.tsx & routes/index.tsx
- Home page initializes onboarding on load
- Routes defined for `/dashboard` and `/settings`

### Dashboard (pages/dashboard.tsx)
- Displays all tasks with filtering
- Shows metrics and statistics
- Allows task status updates and deletion
- Distinguishes sample vs user tasks visually

### Settings (pages/settings.tsx)
- Shows task statistics (total, custom, template)
- Provides reset and removal options
- Displays onboarding status
- Provides dangerous "Clear All" action

## Best Practices

1. **Sample Task Preservation**: User tasks are always preserved when resetting samples
2. **Unique IDs**: Each seeding creates new IDs to prevent conflicts
3. **State Tracking**: Onboarding state prevents accidental repeated seeding
4. **Graceful Fallbacks**: All storage operations have error handling
5. **User Consent**: Destructive actions require confirmation dialogs

## Future Enhancements

- Progress tracking for sample tasks
- Guided tour/tutorial overlay for onboarding
- Customizable sample tasks per user type
- Analytics on which sample tasks users complete
- Option to import/export custom templates

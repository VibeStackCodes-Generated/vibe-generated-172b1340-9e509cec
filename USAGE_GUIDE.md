# FocusSprint - Seed Data and Onboarding Usage Guide

## Quick Start

### Installation & Setup
```bash
npm install
npm run dev
```

Visit `http://localhost:5173/` in your browser.

## User Experience Flow

### First Visit (Onboarding)

When a user visits the application for the first time:

1. **Home Page** (`/`)
   - Displays welcome message
   - Onboarding automatically initializes
   - 3 sample tasks are created and stored
   - User sees "View Dashboard" button

2. **Dashboard** (`/dashboard`)
   - Shows all 3 sample starter template tasks:
     - "Design landing page mockup" (45 min)
     - "Review project requirements" (30 min)
     - "Set up development environment" (20 min)
   - Displays metrics:
     - Total Tasks: 3
     - Completed: 0
     - In Progress: 0
     - Time Saved: 0m
   - Filter tabs available: All, Starter Template, My Tasks

### Creating Custom Tasks

1. From dashboard, click **"New Task"** button
2. Fill in task form:
   - Title (required)
   - Description (optional)
   - Estimated time (5, 15, 30, 45, 60 min or custom)
   - First next step (optional)
3. Click **"Create Task"**
4. New task appears on dashboard with "My Tasks" count increased

### Managing Tasks

**On Dashboard:**
- Change task status using dropdown: New → In Progress → Completed/Partial/Deferred
- Delete task with delete button
- View task metrics update in real-time
- Filter to see: All Tasks, Starter Template only, or My Tasks only

### Resetting to Starter Template

**Settings Page** (`/settings`):

1. Click **"Settings"** button from dashboard
2. View current statistics:
   - Total Tasks count
   - Custom Tasks count
   - Starter Template count
3. Find "Data Management" section
4. Click **"Reset to Starter Template"** button:
   - Confirmation dialog appears
   - System replaces sample tasks with fresh ones
   - **All custom tasks are preserved**
   - Fresh sample tasks have new IDs
   - Redirects to dashboard

### Removing Sample Tasks

1. On Settings page, find "Remove Starter Template" button
2. Confirm action
3. All sample tasks are deleted
4. Custom tasks remain intact
5. Redirects to dashboard

### Clearing Everything

⚠️ **Warning**: This action is irreversible.

1. On Settings page, scroll to "Clear All Tasks" (red section)
2. Confirm action (requires double confirmation)
3. All tasks deleted, including custom tasks
4. Onboarding state resets
5. Next visit will seed fresh sample tasks again

## Sample Tasks Details

### 1. Design Landing Page Mockup
- **Estimated Time**: 45 minutes
- **Description**: Create initial wireframes and visual design for the main landing page. Focus on clear value proposition and CTA placement.
- **First Next Step**: Open Figma and create a new design file with the brand colors

### 2. Review Project Requirements
- **Estimated Time**: 30 minutes
- **Description**: Go through the PRD and acceptance criteria to understand the full scope of work. Take notes on any blockers or clarifications needed.
- **First Next Step**: Read through the entire PRD document and create a summary

### 3. Set Up Development Environment
- **Estimated Time**: 20 minutes
- **Description**: Install all necessary dependencies and configure local development setup. Verify that the application builds and runs correctly.
- **First Next Step**: Run npm install and npm run dev to start the dev server

## Navigation Guide

```
Home (/)
├── View Dashboard → Dashboard (/dashboard)
│   ├── New Task → Create Task (/create)
│   ├── Settings → Settings (/settings)
│   └── View/Filter tasks
└── Create New Task → Create Task (/create)

Dashboard (/dashboard)
├── New Task → Create Task (/create)
├── Settings → Settings (/settings)
├── Filter tabs: All | Starter Template | My Tasks
├── Update task status (dropdown)
├── Delete task (delete button)
└── View metrics

Create Task (/create)
├── Fill form
├── Submit to create task
└── Success message

Settings (/settings)
├── View task statistics
├── View onboarding status
├── Reset to Starter Template
├── Remove Starter Template
├── Clear All Tasks
└── Back to Dashboard
```

## Local Storage

The application stores data in browser's localStorage:

**Keys used:**
- `focussprint:tasks` - Array of all Task objects
- `focussprint:onboarding` - Onboarding state object

**Clear localStorage:**
```javascript
// In browser console
localStorage.removeItem('focussprint:tasks')
localStorage.removeItem('focussprint:onboarding')
```

## API Reference

### Seed Service (`src/services/seed.ts`)

```typescript
// Get sample tasks with IDs
getSampleTasksWithIds(): Task[]

// Check if sample tasks exist in list
hasSeededTasks(tasks: Task[]): boolean

// Get only sample tasks
getSampleTasksFromList(tasks: Task[]): Task[]

// Get only user tasks
getNonSampleTasks(tasks: Task[]): Task[]
```

### Onboarding Service (`src/services/onboarding.ts`)

```typescript
// Check if first visit
isFirstRun(): boolean

// Initialize onboarding (create samples if first run)
initializeOnboarding(): { seededSampleTasks: boolean }

// Get onboarding state
getOnboardingState(): OnboardingState

// Mark onboarding as complete
completeOnboarding(): void

// Reset onboarding (allows re-seeding)
resetOnboarding(): void
```

### Persistence Service (`src/services/persistence.ts`)

```typescript
// Get all tasks
getAllTasks(): Task[]

// Get single task by ID
getTaskById(id: string): Task | null

// Save new task
saveTask(task: Omit<Task, 'id'>): Task

// Update existing task
updateTask(id: string, updates: Partial<Task>): Task | null

// Delete task
deleteTask(id: string): boolean

// Clear all tasks
clearAllTasks(): void
```

## Sample Task ID Format

**Sample Tasks**: `sample_[timestamp]_[random]`
- Example: `sample_1704814800000_abc123def`
- Always prefixed with `sample_`

**User Tasks**: `task_[timestamp]_[random]`
- Example: `task_1704814860000_xyz789uvw`
- Always prefixed with `task_`

## Keyboard Shortcuts

Currently none. Future enhancement could include:
- `Cmd/Ctrl + K` - Command palette
- `Cmd/Ctrl + N` - New task
- `Cmd/Ctrl + D` - Go to dashboard

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (responsive design)

## Troubleshooting

### Tasks not appearing?
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try: `npm run dev` and refresh page

### Settings not applying?
1. Clear browser cache
2. Hard refresh: `Cmd/Ctrl + Shift + R`
3. Check localStorage in DevTools

### Want fresh start?
1. Go to Settings (`/settings`)
2. Click "Clear All Tasks"
3. Confirm twice
4. Reload page
5. Fresh sample tasks will be created

### Developer Mode

To inspect what's happening:

```javascript
// In browser console

// See all tasks
localStorage.getItem('focussprint:tasks')

// See onboarding state
localStorage.getItem('focussprint:onboarding')

// Manually clear (be careful!)
localStorage.clear()
```

## Next Features to Request

- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Calendar view
- [ ] Export/import tasks
- [ ] Collaboration/sharing
- [ ] Mobile app (native)
- [ ] Browser notifications
- [ ] Undo/redo support
- [ ] Dark mode toggle
- [ ] Task templates library

## Support

For issues or feature requests, please refer to the SEEDING_INTEGRATION.md documentation for technical details.

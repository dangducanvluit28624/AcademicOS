export type PlannerDate = string
export type TaskStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high'
export type AcademicEventType =
  'assignment' | 'exam' | 'class' | 'presentation' | 'deadline' | 'other'
export type AcademicEventStatus = 'planned' | 'cancelled'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueAt?: PlannerDate
  subjectId?: string
  createdAt: PlannerDate
  updatedAt: PlannerDate
}

export interface AcademicEvent {
  id: string
  title: string
  type: AcademicEventType
  status: AcademicEventStatus
  startAt: PlannerDate
  endAt?: PlannerDate
  description?: string
  subjectId?: string
  createdAt: PlannerDate
  updatedAt: PlannerDate
}

const taskStatuses = new Set<TaskStatus>([
  'planned',
  'in-progress',
  'completed',
  'cancelled',
])
const taskPriorities = new Set<TaskPriority>(['low', 'medium', 'high'])
const eventTypes = new Set<AcademicEventType>([
  'assignment',
  'exam',
  'class',
  'presentation',
  'deadline',
  'other',
])

function requireText(value: string, field: string): void {
  if (!value.trim()) throw new Error(`${field} is required`)
}

function requireDate(value: string, field: string): void {
  if (!value || Number.isNaN(Date.parse(value))) {
    throw new Error(`${field} must be a valid date`)
  }
}

export function validateTask(task: Task): void {
  requireText(task.id, 'Task id')
  requireText(task.title, 'Task title')
  if (!taskStatuses.has(task.status)) throw new Error('Task status is invalid')
  if (!taskPriorities.has(task.priority))
    throw new Error('Task priority is invalid')
  requireDate(task.createdAt, 'Task createdAt')
  requireDate(task.updatedAt, 'Task updatedAt')
  if (task.dueAt) requireDate(task.dueAt, 'Task dueAt')
}

export function validateAcademicEvent(event: AcademicEvent): void {
  requireText(event.id, 'Academic event id')
  requireText(event.title, 'Academic event title')
  if (!eventTypes.has(event.type))
    throw new Error('Academic event type is invalid')
  if (!new Set<AcademicEventStatus>(['planned', 'cancelled']).has(event.status))
    throw new Error('Academic event status is invalid')
  requireDate(event.startAt, 'Academic event startAt')
  if (event.endAt) {
    requireDate(event.endAt, 'Academic event endAt')
    if (Date.parse(event.endAt) < Date.parse(event.startAt)) {
      throw new Error('Academic event endAt must be on or after startAt')
    }
  }
  requireDate(event.createdAt, 'Academic event createdAt')
  requireDate(event.updatedAt, 'Academic event updatedAt')
}

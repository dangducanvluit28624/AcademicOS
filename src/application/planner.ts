import type { AcademicEvent, Task } from '../domain'
import type {
  AcademicEventRepository,
  SubjectRepository,
  TaskRepository,
} from './ports/academicRepositories'

export interface PlannerRepositories {
  tasks: TaskRepository
  events: AcademicEventRepository
  subjects: SubjectRepository
}

const now = () => new Date().toISOString()
const active = (task: Task) => task.status !== 'cancelled'
const eventActive = (event: AcademicEvent) => event.status !== 'cancelled'

async function validateSubject(
  subjects: SubjectRepository,
  subjectId?: string,
): Promise<void> {
  if (subjectId && !(await subjects.get(subjectId)))
    throw new Error(`Subject ${subjectId} does not exist`)
}

export async function createTask(
  repositories: PlannerRepositories,
  input: Omit<Task, 'createdAt' | 'updatedAt' | 'priority'> &
    Partial<Pick<Task, 'createdAt' | 'updatedAt' | 'priority'>>,
): Promise<Task> {
  const timestamp = now()
  const task = {
    ...input,
    priority: input.priority ?? 'medium',
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  }
  await validateSubject(repositories.subjects, task.subjectId)
  await repositories.tasks.save(task)
  return task
}
export async function updateTask(
  repositories: PlannerRepositories,
  task: Task,
): Promise<Task> {
  await validateSubject(repositories.subjects, task.subjectId)
  const updated = { ...task, updatedAt: now() }
  await repositories.tasks.save(updated)
  return updated
}
export async function completeTask(
  repositories: PlannerRepositories,
  task: Task,
): Promise<Task> {
  return updateTask(repositories, { ...task, status: 'completed' })
}
export async function archiveTask(
  repositories: PlannerRepositories,
  task: Task,
): Promise<Task> {
  return updateTask(repositories, { ...task, status: 'cancelled' })
}
export async function listTasks(
  repositories: PlannerRepositories,
): Promise<Task[]> {
  return (await repositories.tasks.list()).filter(active)
}
export async function getUpcomingTasks(
  repositories: PlannerRepositories,
  from = new Date(),
): Promise<Task[]> {
  return (await listTasks(repositories))
    .filter(
      (task) =>
        task.status !== 'completed' &&
        task.dueAt &&
        Date.parse(task.dueAt) >= from.getTime(),
    )
    .sort((a, b) => Date.parse(a.dueAt!) - Date.parse(b.dueAt!))
}
export async function createAcademicEvent(
  repositories: PlannerRepositories,
  event: AcademicEvent,
): Promise<AcademicEvent> {
  await validateSubject(repositories.subjects, event.subjectId)
  await repositories.events.save(event)
  return event
}
export async function updateAcademicEvent(
  repositories: PlannerRepositories,
  event: AcademicEvent,
): Promise<AcademicEvent> {
  await validateSubject(repositories.subjects, event.subjectId)
  const updated = { ...event, updatedAt: now() }
  await repositories.events.save(updated)
  return updated
}
export async function archiveAcademicEvent(
  repositories: PlannerRepositories,
  event: AcademicEvent,
): Promise<AcademicEvent> {
  return updateAcademicEvent(repositories, { ...event, status: 'cancelled' })
}
export async function listAcademicEvents(
  repositories: PlannerRepositories,
): Promise<AcademicEvent[]> {
  return (await repositories.events.list()).filter(eventActive)
}
export async function getUpcomingEvents(
  repositories: PlannerRepositories,
  from = new Date(),
): Promise<AcademicEvent[]> {
  return (await listAcademicEvents(repositories))
    .filter(eventActive)
    .filter((event) => Date.parse(event.startAt) >= from.getTime())
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
}

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { AcademicEvent, Subject, Task } from '../../domain'
import type { PlannerRepositories } from '../../application'
import {
  archiveAcademicEvent,
  archiveTask,
  completeTask,
  createAcademicEvent,
  createTask,
  listAcademicEvents,
  listTasks,
  updateAcademicEvent,
  updateTask,
} from '../../application'

const stamp = () => new Date().toISOString()
const makeId = () => crypto.randomUUID()
const localDay = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function Planner({
  repositories,
}: {
  repositories: PlannerRepositories
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<AcademicEvent[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [view, setView] = useState<'today' | 'upcoming' | 'all'>('today')
  const [message, setMessage] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskSubjectId, setTaskSubjectId] = useState('')
  const [taskDueAt, setTaskDueAt] = useState('')
  const [taskStatus, setTaskStatus] = useState<Task['status']>('planned')
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('medium')
  const [taskEditId, setTaskEditId] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [eventSubjectId, setEventSubjectId] = useState('')
  const [eventStartAt, setEventStartAt] = useState('')
  const [eventEndAt, setEventEndAt] = useState('')
  const [eventType, setEventType] = useState<AcademicEvent['type']>('other')
  const [eventEditId, setEventEditId] = useState('')

  const reload = useCallback(async () => {
    const [nextTasks, nextEvents, nextSubjects] = await Promise.all([
      listTasks(repositories),
      listAcademicEvents(repositories),
      repositories.subjects.list(),
    ])
    setTasks(nextTasks)
    setEvents(nextEvents)
    setSubjects(nextSubjects)
  }, [repositories])
  useEffect(() => {
    void reload()
  }, [reload])

  async function submitTask(event: FormEvent) {
    event.preventDefault()
    try {
      const current = taskEditId
        ? tasks.find((task) => task.id === taskEditId)
        : undefined
      const input = {
        id: current?.id ?? makeId(),
        title: taskTitle,
        status: taskStatus,
        priority: taskPriority,
        dueAt: taskDueAt ? new Date(taskDueAt).toISOString() : undefined,
        subjectId: taskSubjectId || undefined,
        createdAt: current?.createdAt ?? stamp(),
        updatedAt: stamp(),
      }
      if (current) await updateTask(repositories, input)
      else await createTask(repositories, input)
      setTaskTitle('')
      setTaskDueAt('')
      setTaskSubjectId('')
      setTaskEditId('')
      setMessage('Task saved')
      await reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save task')
    }
  }

  async function submitEvent(event: FormEvent) {
    event.preventDefault()
    try {
      const current = eventEditId
        ? events.find((item) => item.id === eventEditId)
        : undefined
      const input: AcademicEvent = {
        id: current?.id ?? makeId(),
        title: eventTitle,
        type: eventType,
        status: current?.status ?? 'planned',
        startAt: new Date(eventStartAt).toISOString(),
        endAt: eventEndAt ? new Date(eventEndAt).toISOString() : undefined,
        subjectId: eventSubjectId || undefined,
        createdAt: current?.createdAt ?? stamp(),
        updatedAt: stamp(),
      }
      if (current) await updateAcademicEvent(repositories, input)
      else await createAcademicEvent(repositories, input)
      setEventTitle('')
      setEventStartAt('')
      setEventEndAt('')
      setEventSubjectId('')
      setEventEditId('')
      setMessage('Event saved')
      await reload()
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save event',
      )
    }
  }

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const visibleTasks =
    view === 'today'
      ? tasks.filter((task) => task.dueAt && localDay(task.dueAt) === today)
      : view === 'upcoming'
        ? tasks.filter(
            (task) =>
              task.status !== 'completed' &&
              task.dueAt &&
              Date.parse(task.dueAt) >= Date.now(),
          )
        : tasks
  const visibleEvents =
    view === 'today'
      ? events.filter((item) => localDay(item.startAt) === today)
      : view === 'upcoming'
        ? events.filter((item) => Date.parse(item.startAt) >= Date.now())
        : events
  const subjectName = (subjectId?: string) =>
    subjects.find((subject) => subject.id === subjectId)?.name ??
    (subjectId ? 'Subject unavailable' : 'No subject')
  const subjectOptions = subjects.map((subject) => (
    <option key={subject.id} value={subject.id}>
      {subject.name}
    </option>
  ))

  return (
    <section aria-labelledby="planner-heading">
      <h2 id="planner-heading">Planner</h2>
      <nav aria-label="Planner views">
        <button onClick={() => setView('today')}>Today</button>
        <button onClick={() => setView('upcoming')}>Upcoming</button>
        <button onClick={() => setView('all')}>All</button>
      </nav>
      <p role="status">{message}</p>
      <h3>
        {view === 'today'
          ? 'Today'
          : view === 'upcoming'
            ? 'Upcoming'
            : 'Tasks and events'}
      </h3>
      <ul>
        {visibleTasks.map((task) => (
          <li key={task.id}>
            {task.title}{' '}
            {task.dueAt ? new Date(task.dueAt).toLocaleString() : 'No due date'}{' '}
            ({subjectName(task.subjectId)}) <strong>{task.status}</strong>{' '}
            <button
              onClick={() => {
                setTaskEditId(task.id)
                setTaskTitle(task.title)
                setTaskSubjectId(task.subjectId ?? '')
                setTaskDueAt(task.dueAt ? task.dueAt.slice(0, 16) : '')
                setTaskStatus(task.status)
                setTaskPriority(task.priority)
              }}
            >
              Edit
            </button>{' '}
            <button
              onClick={() => void completeTask(repositories, task).then(reload)}
            >
              Complete
            </button>{' '}
            <button
              onClick={() => void archiveTask(repositories, task).then(reload)}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
      <ul>
        {visibleEvents.map((item) => (
          <li key={item.id}>
            {item.title} {new Date(item.startAt).toLocaleString()} (
            {subjectName(item.subjectId)}) <strong>{item.status}</strong>{' '}
            <button
              onClick={() => {
                setEventEditId(item.id)
                setEventTitle(item.title)
                setEventType(item.type)
                setEventSubjectId(item.subjectId ?? '')
                setEventStartAt(item.startAt.slice(0, 16))
                setEventEndAt(item.endAt?.slice(0, 16) ?? '')
              }}
            >
              Edit
            </button>{' '}
            <button
              onClick={() =>
                void archiveAcademicEvent(repositories, item).then(reload)
              }
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={submitTask}>
        <h3>{taskEditId ? 'Edit task' : 'New task'}</h3>
        <input
          aria-label="Task title"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Task title"
          required
        />
        <input
          aria-label="Task due date"
          type="datetime-local"
          value={taskDueAt}
          onChange={(event) => setTaskDueAt(event.target.value)}
        />
        <select
          aria-label="Task status"
          value={taskStatus}
          onChange={(event) =>
            setTaskStatus(event.target.value as Task['status'])
          }
        >
          <option value="planned">Planned</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          aria-label="Task priority"
          value={taskPriority}
          onChange={(event) =>
            setTaskPriority(event.target.value as Task['priority'])
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          aria-label="Task subject"
          value={taskSubjectId}
          onChange={(event) => setTaskSubjectId(event.target.value)}
        >
          <option value="">No subject</option>
          {subjectOptions}
        </select>
        <button type="submit">Save task</button>
      </form>
      <form onSubmit={submitEvent}>
        <h3>{eventEditId ? 'Edit academic event' : 'New academic event'}</h3>
        <input
          aria-label="Event title"
          value={eventTitle}
          onChange={(event) => setEventTitle(event.target.value)}
          placeholder="Event title"
          required
        />
        <select
          aria-label="Event type"
          value={eventType}
          onChange={(event) =>
            setEventType(event.target.value as AcademicEvent['type'])
          }
        >
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
          <option value="class">Class</option>
          <option value="presentation">Presentation</option>
          <option value="deadline">Deadline</option>
          <option value="other">Other</option>
        </select>
        <input
          aria-label="Event start"
          type="datetime-local"
          value={eventStartAt}
          onChange={(event) => setEventStartAt(event.target.value)}
          required
        />
        <input
          aria-label="Event end"
          type="datetime-local"
          value={eventEndAt}
          onChange={(event) => setEventEndAt(event.target.value)}
        />
        <select
          aria-label="Event subject"
          value={eventSubjectId}
          onChange={(event) => setEventSubjectId(event.target.value)}
        >
          <option value="">No subject</option>
          {subjectOptions}
        </select>
        <button type="submit">Save event</button>
      </form>
    </section>
  )
}

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
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge, StatusBadge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit2,
  XCircle,
  Plus,
  Tag,
  X,
} from 'lucide-react'

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

  const viewHeadingText =
    view === 'today'
      ? 'Today'
      : view === 'upcoming'
        ? 'Upcoming'
        : 'Tasks and events'

  return (
    <section aria-labelledby="planner-heading" className="space-y-6">
      <PageHeader
        id="planner-heading"
        title="Planner"
        subtitle="Manage academic deadlines, course assignments, exams, and milestones"
        actions={
          <nav
            aria-label="Planner views"
            className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs"
          >
            {(['today', 'upcoming', 'all'] as const).map((v) => {
              const label = v.charAt(0).toUpperCase() + v.slice(1)
              const isActive = view === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </nav>
        }
      />

      {message && (
        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center justify-between">
          <p role="status">{message}</p>
          <button
            onClick={() => setMessage('')}
            className="text-indigo-400 hover:text-indigo-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Tasks & Events */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active View Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              {viewHeadingText}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {visibleTasks.length} task(s) • {visibleEvents.length} event(s)
            </span>
          </div>

          {/* Tasks Container */}
          <Card
            title="Course Tasks & Assignments"
            subtitle="Actionable items with priority and due date tracking"
            icon={<CalendarCheck className="w-4 h-4 text-indigo-600" />}
          >
            {visibleTasks.length > 0 ? (
              <ul className="divide-y divide-slate-100 -mx-5 -my-5 list-none p-0">
                {visibleTasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-800 tracking-tight">
                          {task.title}
                        </span>
                        <StatusBadge status={task.status} />
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'danger'
                              : task.priority === 'medium'
                                ? 'warning'
                                : 'neutral'
                          }
                          size="sm"
                        >
                          {task.priority} priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {task.dueAt
                            ? new Date(task.dueAt).toLocaleString()
                            : 'No due date'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />(
                          {subjectName(task.subjectId)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setTaskEditId(task.id)
                          setTaskTitle(task.title)
                          setTaskSubjectId(task.subjectId ?? '')
                          setTaskDueAt(
                            task.dueAt ? task.dueAt.slice(0, 16) : '',
                          )
                          setTaskStatus(task.status)
                          setTaskPriority(task.priority)
                        }}
                        icon={<Edit2 className="w-3 h-3" />}
                      >
                        Edit
                      </Button>
                      {task.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            void completeTask(repositories, task).then(reload)
                          }
                          icon={<CheckCircle2 className="w-3 h-3" />}
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          void archiveTask(repositories, task).then(reload)
                        }
                        icon={<XCircle className="w-3 h-3" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No tasks in this view"
                description="Use the task form on the right to schedule assignments or coursework."
                icon={<CalendarCheck className="w-8 h-8 text-slate-400" />}
              />
            )}
          </Card>

          {/* Academic Events Container */}
          <Card
            title="Academic Events & Exams"
            subtitle="Lectures, midterms, presentations, and key university milestones"
            icon={<CalendarDays className="w-4 h-4 text-blue-600" />}
          >
            {visibleEvents.length > 0 ? (
              <ul className="divide-y divide-slate-100 -mx-5 -my-5 list-none p-0">
                {visibleEvents.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-slate-800 tracking-tight">
                          {item.title}
                        </span>
                        <Badge variant="purple" size="sm">
                          {item.type}
                        </Badge>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(item.startAt).toLocaleString()}
                          {item.endAt
                            ? ` - ${new Date(item.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />(
                          {subjectName(item.subjectId)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEventEditId(item.id)
                          setEventTitle(item.title)
                          setEventType(item.type)
                          setEventSubjectId(item.subjectId ?? '')
                          setEventStartAt(item.startAt.slice(0, 16))
                          setEventEndAt(item.endAt?.slice(0, 16) ?? '')
                        }}
                        icon={<Edit2 className="w-3 h-3" />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          void archiveAcademicEvent(repositories, item).then(
                            reload,
                          )
                        }
                        icon={<XCircle className="w-3 h-3" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No academic events in this view"
                description="Create lecture schedules, exams, or meetings using the event form on the right."
                icon={<CalendarDays className="w-8 h-8 text-slate-400" />}
              />
            )}
          </Card>
        </div>

        {/* Right Column: Creation & Edit Forms */}
        <div className="lg:col-span-5 space-y-6">
          {/* Task Form Card */}
          <Card
            title={taskEditId ? 'Edit Task' : 'New Task'}
            subtitle="Track deliverables, project stages, and assignments"
            icon={<CalendarCheck className="w-4 h-4 text-indigo-600" />}
          >
            <form onSubmit={submitTask} className="space-y-4">
              <h3 className="sr-only">
                {taskEditId ? 'Edit task' : 'New task'}
              </h3>
              <Input
                label="Task Title"
                aria-label="Task title"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="e.g. Complete Problem Set 3"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Due Date & Time"
                  aria-label="Task due date"
                  type="datetime-local"
                  value={taskDueAt}
                  onChange={(event) => setTaskDueAt(event.target.value)}
                />

                <Select
                  label="Subject"
                  aria-label="Task subject"
                  value={taskSubjectId}
                  onChange={(event) => setTaskSubjectId(event.target.value)}
                >
                  <option value="">No subject</option>
                  {subjectOptions}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Status"
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
                </Select>

                <Select
                  label="Priority"
                  aria-label="Task priority"
                  value={taskPriority}
                  onChange={(event) =>
                    setTaskPriority(event.target.value as Task['priority'])
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={
                    taskEditId ? (
                      <Edit2 className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                >
                  Save task
                </Button>
                {taskEditId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setTaskEditId('')
                      setTaskTitle('')
                      setTaskDueAt('')
                      setTaskSubjectId('')
                    }}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Academic Event Form Card */}
          <Card
            title={eventEditId ? 'Edit Academic Event' : 'New Academic Event'}
            subtitle="Add timed events such as exams, classes, or presentations"
            icon={<CalendarDays className="w-4 h-4 text-blue-600" />}
          >
            <form onSubmit={submitEvent} className="space-y-4">
              <h3 className="sr-only">
                {eventEditId ? 'Edit academic event' : 'New academic event'}
              </h3>
              <Input
                label="Event Title"
                aria-label="Event title"
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                placeholder="e.g. Midterm Examination"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Event Type"
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
                </Select>

                <Select
                  label="Subject"
                  aria-label="Event subject"
                  value={eventSubjectId}
                  onChange={(event) => setEventSubjectId(event.target.value)}
                >
                  <option value="">No subject</option>
                  {subjectOptions}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Start Time"
                  aria-label="Event start"
                  type="datetime-local"
                  value={eventStartAt}
                  onChange={(event) => setEventStartAt(event.target.value)}
                  required
                />

                <Input
                  label="End Time (Optional)"
                  aria-label="Event end"
                  type="datetime-local"
                  value={eventEndAt}
                  onChange={(event) => setEventEndAt(event.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={
                    eventEditId ? (
                      <Edit2 className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                >
                  Save event
                </Button>
                {eventEditId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEventEditId('')
                      setEventTitle('')
                      setEventStartAt('')
                      setEventEndAt('')
                      setEventSubjectId('')
                    }}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}

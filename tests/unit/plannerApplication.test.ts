import { describe, expect, it } from 'vitest'
import {
  archiveTask,
  completeTask,
  createTask,
  getUpcomingTasks,
  type PlannerRepositories,
} from '../../src/application'
import type { Task } from '../../src/domain'

function repositories(): PlannerRepositories {
  const tasks: Task[] = []
  return {
    tasks: {
      get: async (id) => tasks.find((task) => task.id === id),
      list: async () => tasks,
      save: async (task) => {
        const index = tasks.findIndex((item) => item.id === task.id)
        if (index < 0) tasks.push(task)
        else tasks[index] = task
      },
    },
    events: {
      get: async () => undefined,
      list: async () => [],
      save: async () => undefined,
    },
    subjects: {
      get: async (id) =>
        id === 'subject-1' ? { id, name: 'Math', credits: 3 } : undefined,
      list: async () => [],
      save: async () => undefined,
    },
  }
}

describe('M4 Planner application services', () => {
  it('creates with medium priority, updates completion, and archives the same task', async () => {
    const planner = repositories()
    const task = await createTask(planner, {
      id: 'task-1',
      title: 'Read',
      status: 'planned',
      subjectId: 'subject-1',
    })
    expect(task.priority).toBe('medium')
    const completed = await completeTask(planner, task)
    expect(completed.id).toBe(task.id)
    expect(await planner.tasks.list()).toHaveLength(1)
    await archiveTask(planner, completed)
    expect(await getUpcomingTasks(planner, new Date('2026-01-01'))).toEqual([])
  })
  it('rejects an unavailable subject reference', async () => {
    const planner = repositories()
    await expect(
      createTask(planner, {
        id: 'task-1',
        title: 'Read',
        status: 'planned',
        subjectId: 'missing',
      }),
    ).rejects.toThrow('Subject missing does not exist')
  })
  it('filters completed, cancelled, and undated tasks from upcoming tasks', async () => {
    const planner = repositories()
    await createTask(planner, {
      id: 'task-incomplete',
      title: 'T1',
      status: 'planned',
      dueAt: '2026-08-30T10:00',
    })
    await createTask(planner, {
      id: 'task-completed',
      title: 'T2',
      status: 'completed',
      dueAt: '2026-08-30T10:00',
    })
    await createTask(planner, {
      id: 'task-cancelled',
      title: 'T3',
      status: 'cancelled',
      dueAt: '2026-08-30T10:00',
    })
    await createTask(planner, {
      id: 'task-undated',
      title: 'T4',
      status: 'planned',
    })
    const upcoming = await getUpcomingTasks(
      planner,
      new Date('2026-08-01T00:00'),
    )
    expect(upcoming).toHaveLength(1)
    expect(upcoming[0].id).toBe('task-incomplete')
  })
})

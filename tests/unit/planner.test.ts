import { describe, expect, it } from 'vitest'
import { validateAcademicEvent, validateTask } from '../../src/domain'

const dates = {
  createdAt: '2026-08-27T09:00:00.000Z',
  updatedAt: '2026-08-27T09:00:00.000Z',
}

describe('M4 Planner domain', () => {
  it('validates a task with optional subject and due date', () => {
    expect(() =>
      validateTask({
        id: 'task-1',
        title: 'Read',
        status: 'planned',
        priority: 'medium',
        subjectId: 'subject-1',
        dueAt: '2026-08-28T10:00:00.000Z',
        ...dates,
      }),
    ).not.toThrow()
    expect(() =>
      validateTask({
        id: 'task-1',
        title: 'Read',
        status: 'planned',
        priority: 'medium',
        ...dates,
      }),
    ).not.toThrow()
  })
  it('rejects invalid task values', () => {
    expect(() =>
      validateTask({
        id: 'task-1',
        title: '',
        status: 'planned',
        priority: 'medium',
        ...dates,
      }),
    ).toThrow('Task title is required')
    expect(() =>
      validateTask({
        id: 'task-1',
        title: 'Read',
        status: 'bad' as never,
        priority: 'medium',
        ...dates,
      }),
    ).toThrow('Task status is invalid')
    expect(() =>
      validateTask({
        id: 'task-1',
        title: 'Read',
        status: 'planned',
        priority: 'bad' as never,
        dueAt: 'bad',
        ...dates,
      }),
    ).toThrow('Task priority is invalid')
  })
  it('validates event ranges including equal times', () => {
    expect(() =>
      validateAcademicEvent({
        id: 'event-1',
        title: 'Exam',
        type: 'exam',
        status: 'planned',
        startAt: dates.createdAt,
        endAt: dates.createdAt,
        ...dates,
      }),
    ).not.toThrow()
    expect(() =>
      validateAcademicEvent({
        id: 'event-1',
        title: 'Exam',
        type: 'exam',
        status: 'planned',
        startAt: dates.updatedAt,
        endAt: '2026-08-27T08:00:00.000Z',
        ...dates,
      }),
    ).toThrow('endAt must be on or after')
    expect(() =>
      validateAcademicEvent({
        id: 'event-1',
        title: 'Exam',
        type: 'bad' as never,
        status: 'planned',
        startAt: dates.createdAt,
        ...dates,
      }),
    ).toThrow('event type is invalid')
  })
})

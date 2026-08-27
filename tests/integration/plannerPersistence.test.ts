import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  IndexedDbAcademicEventRepository,
  IndexedDbTaskRepository,
} from '../../src/infrastructure/persistence/plannerRepositories'
import { IndexedDbSubjectRepository } from '../../src/infrastructure/persistence/academicRepositories'
import {
  databaseName,
  IndexedDbDatabase,
} from '../../src/infrastructure/persistence/indexedDbDatabase'

describe('Planner IndexedDB persistence', () => {
  beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  it('supports Task save/read round trip', async () => {
    const database = new IndexedDbDatabase()
    await database.open()
    const subjects = new IndexedDbSubjectRepository(database)
    const tasks = new IndexedDbTaskRepository(database, subjects)

    const task = {
      id: 'task-1',
      title: 'Read chapter',
      status: 'planned' as const,
      priority: 'high' as const,
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-27T09:00:00.000Z',
    }
    await tasks.save(task)

    await expect(tasks.get(task.id)).resolves.toEqual(task)
    database.close()
  })

  it('supports AcademicEvent save/read round trip', async () => {
    const database = new IndexedDbDatabase()
    await database.open()
    const subjects = new IndexedDbSubjectRepository(database)
    const events = new IndexedDbAcademicEventRepository(database, subjects)

    const event = {
      id: 'event-1',
      title: 'Final Exam',
      type: 'exam' as const,
      status: 'planned' as const,
      startAt: '2026-08-28T09:00:00.000Z',
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-27T09:00:00.000Z',
    }
    await events.save(event)

    await expect(events.get(event.id)).resolves.toEqual(event)
    database.close()
  })

  it('enforces subject reference validation', async () => {
    const database = new IndexedDbDatabase()
    await database.open()
    const subjects = new IndexedDbSubjectRepository(database)
    const tasks = new IndexedDbTaskRepository(database, subjects)

    await expect(
      tasks.save({
        id: 'task-missing',
        title: 'T1',
        status: 'planned',
        priority: 'medium',
        subjectId: 'missing',
        createdAt: '2026-08-27T09:00:00.000Z',
        updatedAt: '2026-08-27T09:00:00.000Z',
      }),
    ).rejects.toThrow('Subject missing does not exist')
    database.close()
  })

  it('preserves v3 data upon migrating to v4 schema', async () => {
    const versionThree = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(databaseName, 3)
      request.onupgradeneeded = () => {
        const database = request.result
        for (const storeName of [
          'studentProfiles',
          'academicPrograms',
          'academicYears',
          'semesters',
          'subjects',
          'enrollments',
          'grades',
        ]) {
          if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName, { keyPath: 'id' })
          }
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    const transaction = versionThree.transaction('subjects', 'readwrite')
    transaction.objectStore('subjects').put({
      id: 'subject-1',
      name: 'Math',
      credits: 3,
    })
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
    versionThree.close()

    // Upgrades to v4
    const database = new IndexedDbDatabase()
    await database.open()
    const subjects = new IndexedDbSubjectRepository(database)
    const tasks = new IndexedDbTaskRepository(database, subjects)

    await tasks.save({
      id: 'task-1',
      title: 'Math homework',
      status: 'planned',
      priority: 'low',
      subjectId: 'subject-1',
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-27T09:00:00.000Z',
    })

    expect((await tasks.list()).length).toBe(1)

    database.close()
  })
})

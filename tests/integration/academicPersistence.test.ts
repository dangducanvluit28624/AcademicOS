import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  IndexedDbGradeRepository,
  IndexedDbStudentProfileRepository,
  IndexedDbAcademicYearRepository,
  IndexedDbEnrollmentRepository,
  IndexedDbSemesterRepository,
  IndexedDbSubjectRepository,
} from '../../src/infrastructure/persistence/academicRepositories'
import {
  IndexedDbAcademicEventRepository,
  IndexedDbTaskRepository,
} from '../../src/infrastructure/persistence/plannerRepositories'
import {
  academicStores,
  databaseName,
  IndexedDbDatabase,
} from '../../src/infrastructure/persistence/indexedDbDatabase'

describe('academic IndexedDB persistence', () => {
  beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  it('creates the seven authoritative academic stores', async () => {
    const database = new IndexedDbDatabase()
    await database.open()

    const stores = await new Promise<string[]>((resolve, reject) => {
      const request = indexedDB.open(databaseName)
      request.onsuccess = () => {
        resolve(Array.from(request.result.objectStoreNames))
        request.result.close()
      }
      request.onerror = () => reject(request.error)
    })

    expect(stores).toEqual(expect.arrayContaining([...academicStores]))
    database.close()
  })

  it('saves and retrieves a subject through IndexedDB', async () => {
    const database = new IndexedDbDatabase()
    const repository = new IndexedDbSubjectRepository(database)
    const subject = {
      id: 'subject-1',
      code: 'CS101',
      name: 'Algorithms',
      credits: 3,
    }

    await repository.save(subject)

    await expect(repository.get(subject.id)).resolves.toEqual(subject)
    database.close()
  })

  it('preserves the academic year to semester to enrollment references', async () => {
    const database = new IndexedDbDatabase()
    const years = new IndexedDbAcademicYearRepository(database)
    const semesters = new IndexedDbSemesterRepository(database)
    const subjects = new IndexedDbSubjectRepository(database)
    const enrollments = new IndexedDbEnrollmentRepository(database)

    await years.save({ id: 'year-1', label: '2026-2027' })
    await semesters.save({
      id: 'semester-1',
      academicYearId: 'year-1',
      name: 'Fall',
      status: 'active',
    })
    await subjects.save({ id: 'subject-1', name: 'Algorithms', credits: 3 })
    await enrollments.save({
      id: 'enrollment-1',
      subjectId: 'subject-1',
      semesterId: 'semester-1',
      status: 'in-progress',
    })

    await expect(enrollments.get('enrollment-1')).resolves.toMatchObject({
      subjectId: 'subject-1',
      semesterId: 'semester-1',
    })
    database.close()
  })

  it('rejects an enrollment with a missing subject reference', async () => {
    const database = new IndexedDbDatabase()
    const repository = new IndexedDbEnrollmentRepository(database)

    await expect(
      repository.save({
        id: 'enrollment-1',
        subjectId: 'missing',
        semesterId: 'semester-1',
        status: 'planned',
      }),
    ).rejects.toThrow('Subject missing does not exist')
    database.close()
  })

  it('rejects a second planned or in-progress enrollment for the same subject and semester', async () => {
    const database = new IndexedDbDatabase()
    const years = new IndexedDbAcademicYearRepository(database)
    const semesters = new IndexedDbSemesterRepository(database)
    const subjects = new IndexedDbSubjectRepository(database)
    const enrollments = new IndexedDbEnrollmentRepository(database)

    await years.save({ id: 'year-1', label: '2026-2027' })
    await semesters.save({
      id: 'semester-1',
      academicYearId: 'year-1',
      name: 'Fall',
      status: 'active',
    })
    await subjects.save({ id: 'subject-1', name: 'Algorithms', credits: 3 })
    await enrollments.save({
      id: 'enrollment-1',
      subjectId: 'subject-1',
      semesterId: 'semester-1',
      status: 'planned',
    })

    await expect(
      enrollments.save({
        id: 'enrollment-2',
        subjectId: 'subject-1',
        semesterId: 'semester-1',
        status: 'in-progress',
      }),
    ).rejects.toThrow('An active enrollment already exists')
    database.close()
  })

  it('persists the user-provided overall GPA without calculating it', async () => {
    const database = new IndexedDbDatabase()
    const profiles = new IndexedDbStudentProfileRepository(database)
    const profile = {
      id: 'profile-1',
      name: 'Ada Student',
      overallGpa: 3.42,
    }

    await profiles.save(profile)

    await expect(profiles.get(profile.id)).resolves.toEqual(profile)
    database.close()
  })

  it('persists a converted course grade alongside its original score', async () => {
    const database = new IndexedDbDatabase()
    const years = new IndexedDbAcademicYearRepository(database)
    const semesters = new IndexedDbSemesterRepository(database)
    const subjects = new IndexedDbSubjectRepository(database)
    const enrollments = new IndexedDbEnrollmentRepository(database)
    const grades = new IndexedDbGradeRepository(database)

    await years.save({ id: 'year-1', label: '2026-2027' })
    await semesters.save({
      id: 'semester-1',
      academicYearId: 'year-1',
      name: 'Fall',
      status: 'active',
    })
    await subjects.save({ id: 'subject-1', name: 'Algorithms', credits: 3 })
    await enrollments.save({
      id: 'enrollment-1',
      subjectId: 'subject-1',
      semesterId: 'semester-1',
      status: 'completed',
    })
    const grade = {
      id: 'grade-1',
      enrollmentId: 'enrollment-1',
      value: '8.5',
      originalScore: 8.5,
      letterGrade: 'B+',
      fourPointValue: 3.5,
      finalized: true,
    }

    await grades.save(grade)

    await expect(grades.get(grade.id)).resolves.toEqual(grade)
    database.close()
  })

  it('creates planner stores and preserves academic data in schema version 4', async () => {
    const database = new IndexedDbDatabase()
    const subjects = new IndexedDbSubjectRepository(database)
    await subjects.save({ id: 'subject-1', name: 'Algorithms', credits: 3 })
    const tasks = new IndexedDbTaskRepository(database, subjects)
    const events = new IndexedDbAcademicEventRepository(database, subjects)
    const task = {
      id: 'task-1',
      title: 'Read',
      status: 'planned' as const,
      priority: 'medium' as const,
      subjectId: 'subject-1',
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-27T09:00:00.000Z',
    }
    const event = {
      id: 'event-1',
      title: 'Exam',
      type: 'exam' as const,
      status: 'planned' as const,
      subjectId: 'subject-1',
      startAt: '2026-08-28T09:00:00.000Z',
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
    await tasks.save(task)
    await events.save(event)
    expect(await database.list('subjects')).toEqual([
      expect.objectContaining({ id: 'subject-1' }),
    ])
    await expect(tasks.get('task-1')).resolves.toEqual(task)
    await expect(events.get('event-1')).resolves.toEqual(event)
    const inspectedDatabase = await new Promise<IDBDatabase>(
      (resolve, reject) => {
        const request = indexedDB.open(databaseName)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      },
    )
    expect(Array.from(inspectedDatabase.objectStoreNames)).toEqual(
      expect.arrayContaining(['tasks', 'academicEvents']),
    )
    inspectedDatabase.close()
    database.close()
  })

  it('rejects planner records with missing subject references', async () => {
    const database = new IndexedDbDatabase()
    const subjects = new IndexedDbSubjectRepository(database)
    const tasks = new IndexedDbTaskRepository(database, subjects)
    await expect(
      tasks.save({
        id: 'task-1',
        title: 'Read',
        status: 'planned',
        priority: 'medium',
        subjectId: 'missing',
        createdAt: '2026-08-27T09:00:00.000Z',
        updatedAt: '2026-08-27T09:00:00.000Z',
      }),
    ).rejects.toThrow('Subject missing does not exist')
    database.close()
  })

  it('migrates a populated version 3 database to version 4 without resetting academic data', async () => {
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
      name: 'Preserved subject',
      credits: 3,
    })
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
    versionThree.close()

    const migrated = new IndexedDbDatabase()
    await migrated.open()
    await expect(migrated.get('subjects', 'subject-1')).resolves.toEqual({
      id: 'subject-1',
      name: 'Preserved subject',
      credits: 3,
    })
    expect(await migrated.list('tasks')).toEqual([])
    expect(await migrated.list('academicEvents')).toEqual([])
    migrated.close()
  })
})

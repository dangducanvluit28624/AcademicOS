import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  databaseName,
  IndexedDbDatabase,
} from '../../src/infrastructure/persistence/indexedDbDatabase'
import {
  IndexedDbStudentProfileRepository,
  IndexedDbAcademicProgramRepository,
  IndexedDbAcademicYearRepository,
  IndexedDbSemesterRepository,
  IndexedDbSubjectRepository,
  IndexedDbEnrollmentRepository,
  IndexedDbGradeRepository,
} from '../../src/infrastructure/persistence/academicRepositories'
import {
  IndexedDbTaskRepository,
  IndexedDbAcademicEventRepository,
} from '../../src/infrastructure/persistence/plannerRepositories'
import { IndexedDbGoalsRepository } from '../../src/infrastructure/persistence/goalRepositories'
import { createBackup, restoreBackup } from '../../src/application/backup'

describe('M5 Backup and Restore Integration', () => {
  beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })

  it('creates and restores a backup correctly', async () => {
    const database = new IndexedDbDatabase()
    await database.open()

    const profiles = new IndexedDbStudentProfileRepository(database)
    const programs = new IndexedDbAcademicProgramRepository(database)
    const years = new IndexedDbAcademicYearRepository(database)
    const semesters = new IndexedDbSemesterRepository(database)
    const subjects = new IndexedDbSubjectRepository(database)
    const enrollments = new IndexedDbEnrollmentRepository(database)
    const grades = new IndexedDbGradeRepository(database)

    const tasks = new IndexedDbTaskRepository(database, subjects)
    const events = new IndexedDbAcademicEventRepository(database, subjects)

    const repositories = {
      profiles,
      programs,
      years,
      semesters,
      subjects,
      enrollments,
      grades,
    }
    const plannerRepositories = { tasks, events, subjects }
    const goalRepositories = { goals: new IndexedDbGoalsRepository(database) }

    // Seed Data
    await profiles.save({ id: 'prof-1', name: 'Alice', overallGpa: 3.5 })
    await programs.save({ id: 'prog-1', name: 'Computer Science' })
    await years.save({ id: 'year-1', label: '2026' })
    await semesters.save({
      id: 'sem-1',
      academicYearId: 'year-1',
      name: 'Fall 2026',
      status: 'active',
    })
    await subjects.save({ id: 'sub-1', name: 'Algorithms', credits: 4 })
    await enrollments.save({
      id: 'enr-1',
      subjectId: 'sub-1',
      semesterId: 'sem-1',
      status: 'completed',
    })
    await grades.save({
      id: 'grd-1',
      enrollmentId: 'enr-1',
      value: 'A',
      finalized: true,
      letterGrade: 'A',
    })
    await tasks.save({
      id: 'tsk-1',
      title: 'Study',
      status: 'planned',
      priority: 'high',
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-27T09:00:00.000Z',
    })
    await events.save({
      id: 'evt-1',
      title: 'Exam',
      type: 'exam',
      status: 'planned',
      startAt: '2026-08-28T09:00:00.000Z',
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-27T09:00:00.000Z',
    })

    // Create Backup
    const backup = await createBackup(
      repositories,
      plannerRepositories,
      goalRepositories,
    )

    // Verify backup contents
    expect(backup.formatVersion).toBe(1)
    expect(backup.data.studentProfiles).toHaveLength(1)
    expect(backup.data.studentProfiles[0].overallGpa).toBe(3.5)
    expect(backup.data.tasks).toHaveLength(1)

    // Modify Database
    await profiles.save({
      id: 'prof-1',
      name: 'Alice Modified',
      overallGpa: 2.0,
    })
    await tasks.save({
      id: 'tsk-1',
      title: 'Study More',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2026-08-27T09:00:00.000Z',
      updatedAt: '2026-08-28T09:00:00.000Z',
    })

    // Restore Backup
    await restoreBackup(backup, database)

    // Verify Restored Data
    const restoredProfile = await profiles.get('prof-1')
    expect(restoredProfile?.name).toBe('Alice')
    expect(restoredProfile?.overallGpa).toBe(3.5) // authoritative GPA preserved

    const restoredTask = await tasks.get('tsk-1')
    expect(restoredTask?.title).toBe('Study')

    database.close()
  })

  it('rolls back if restore fails', async () => {
    const database = new IndexedDbDatabase()
    await database.open()
    const profiles = new IndexedDbStudentProfileRepository(database)
    const programs = new IndexedDbAcademicProgramRepository(database)
    const years = new IndexedDbAcademicYearRepository(database)
    const semesters = new IndexedDbSemesterRepository(database)
    const subjects = new IndexedDbSubjectRepository(database)
    const enrollments = new IndexedDbEnrollmentRepository(database)
    const grades = new IndexedDbGradeRepository(database)
    const tasks = new IndexedDbTaskRepository(database, subjects)
    const events = new IndexedDbAcademicEventRepository(database, subjects)

    const repositories = {
      profiles,
      programs,
      years,
      semesters,
      subjects,
      enrollments,
      grades,
    }
    const plannerRepositories = { tasks, events, subjects }
    const goalRepositories = { goals: new IndexedDbGoalsRepository(database) }

    await profiles.save({ id: 'prof-1', name: 'Original', overallGpa: 3.0 })

    const backup = await createBackup(
      repositories,
      plannerRepositories,
      goalRepositories,
    )

    // Corrupt the backup manually for testing failure
    // Adding a grade that refers to a missing enrollment
    backup.data.grades.push({
      id: 'grd-bad',
      enrollmentId: 'enr-missing',
      value: 'F',
      finalized: true,
      letterGrade: 'F',
    })

    // Restore should fail validation before mutating
    await expect(restoreBackup(backup, database)).rejects.toThrow()

    // DB should remain unchanged
    const profile = await profiles.get('prof-1')
    expect(profile?.name).toBe('Original')

    database.close()
  })
})

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
})

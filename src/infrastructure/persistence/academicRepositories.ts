import type {
  AcademicProgramRepository,
  AcademicYearRepository,
  EnrollmentRepository,
  GradeRepository,
  SemesterRepository,
  StudentProfileRepository,
  SubjectRepository,
} from '../../application/ports/academicRepositories'
import type {
  AcademicProgram,
  AcademicYear,
  Enrollment,
  Grade,
  Semester,
  StudentProfile,
  Subject,
} from '../../domain'
import {
  validateAcademicProgram,
  validateAcademicYear,
  validateEnrollment,
  validateGrade,
  validateSemester,
  validateStudentProfile,
  validateSubject,
} from '../../domain'
import { IndexedDbDatabase } from './indexedDbDatabase'

export class IndexedDbStudentProfileRepository implements StudentProfileRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<StudentProfile>('studentProfiles', id)
  }
  list() {
    return this.database.list<StudentProfile>('studentProfiles')
  }
  async save(profile: StudentProfile) {
    validateStudentProfile(profile)
    await this.database.save('studentProfiles', profile)
  }
  async delete(id: string) {
    await this.database.delete('studentProfiles', id)
  }
}

export class IndexedDbAcademicProgramRepository implements AcademicProgramRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<AcademicProgram>('academicPrograms', id)
  }
  list() {
    return this.database.list<AcademicProgram>('academicPrograms')
  }
  async save(program: AcademicProgram) {
    validateAcademicProgram(program)
    await this.database.save('academicPrograms', program)
  }
  async delete(id: string) {
    await this.database.delete('academicPrograms', id)
  }
}

export class IndexedDbAcademicYearRepository implements AcademicYearRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<AcademicYear>('academicYears', id)
  }
  list() {
    return this.database.list<AcademicYear>('academicYears')
  }
  async save(year: AcademicYear) {
    validateAcademicYear(year)
    await this.database.save('academicYears', year)
  }
  async delete(id: string) {
    await this.database.delete('academicYears', id)
  }
}

export class IndexedDbSemesterRepository implements SemesterRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<Semester>('semesters', id)
  }
  list() {
    return this.database.list<Semester>('semesters')
  }
  async save(semester: Semester) {
    validateSemester(semester)
    if (
      !(await this.database.get<AcademicYear>(
        'academicYears',
        semester.academicYearId,
      ))
    ) {
      throw new Error(`Academic year ${semester.academicYearId} does not exist`)
    }
    await this.database.save('semesters', semester)
  }
  async delete(id: string) {
    await this.database.delete('semesters', id)
  }
}

export class IndexedDbSubjectRepository implements SubjectRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<Subject>('subjects', id)
  }
  list() {
    return this.database.list<Subject>('subjects')
  }
  async save(subject: Subject) {
    validateSubject(subject)
    if (
      subject.academicProgramId &&
      !(await this.database.get<AcademicProgram>(
        'academicPrograms',
        subject.academicProgramId,
      ))
    ) {
      throw new Error(
        `Academic program ${subject.academicProgramId} does not exist`,
      )
    }
    await this.database.save('subjects', subject)
  }
  async delete(id: string) {
    await this.database.delete('subjects', id)
  }
}

export class IndexedDbEnrollmentRepository implements EnrollmentRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<Enrollment>('enrollments', id)
  }
  list() {
    return this.database.list<Enrollment>('enrollments')
  }
  async save(enrollment: Enrollment) {
    validateEnrollment(enrollment)
    const [subject, semester] = await Promise.all([
      this.database.get<Subject>('subjects', enrollment.subjectId),
      this.database.get<Semester>('semesters', enrollment.semesterId),
    ])
    if (!subject)
      throw new Error(`Subject ${enrollment.subjectId} does not exist`)
    if (!semester)
      throw new Error(`Semester ${enrollment.semesterId} does not exist`)
    if (
      enrollment.status === 'planned' ||
      enrollment.status === 'in-progress'
    ) {
      const existingEnrollments =
        await this.database.list<Enrollment>('enrollments')
      const duplicate = existingEnrollments.find(
        (existing) =>
          existing.id !== enrollment.id &&
          existing.subjectId === enrollment.subjectId &&
          existing.semesterId === enrollment.semesterId &&
          (existing.status === 'planned' || existing.status === 'in-progress'),
      )
      if (duplicate) {
        throw new Error(
          'An active enrollment already exists for this subject and semester',
        )
      }
    }
    await this.database.save('enrollments', enrollment)
  }
  async delete(id: string) {
    await this.database.delete('enrollments', id)
  }
}

export class IndexedDbGradeRepository implements GradeRepository {
  constructor(private readonly database: IndexedDbDatabase) {}
  get(id: string) {
    return this.database.get<Grade>('grades', id)
  }
  list() {
    return this.database.list<Grade>('grades')
  }
  async save(grade: Grade) {
    validateGrade(grade)
    if (
      !(await this.database.get<Enrollment>('enrollments', grade.enrollmentId))
    ) {
      throw new Error(`Enrollment ${grade.enrollmentId} does not exist`)
    }
    await this.database.save('grades', grade)
  }
  async delete(id: string) {
    await this.database.delete('grades', id)
  }
}

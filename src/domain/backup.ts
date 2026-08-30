import type {
  AcademicProgram,
  AcademicYear,
  Enrollment,
  Grade,
  Semester,
  StudentProfile,
  Subject,
} from './academic'
import type { AcademicEvent, Task } from './planner'
import { validateAcademicEvent, validateTask } from './planner'
import type { AcademicGoal } from './goals'
import { validateAcademicGoal } from './goals'
import {
  DomainValidationError,
  validateAcademicProgram,
  validateAcademicYear,
  validateEnrollment,
  validateGrade,
  validateSemester,
  validateStudentProfile,
  validateSubject,
} from './validation'

export interface BackupData {
  studentProfiles: StudentProfile[]
  academicPrograms: AcademicProgram[]
  academicYears: AcademicYear[]
  semesters: Semester[]
  subjects: Subject[]
  enrollments: Enrollment[]
  grades: Grade[]
  tasks: Task[]
  academicEvents: AcademicEvent[]
  goals: AcademicGoal[]
}

export interface BackupEnvelope {
  formatVersion: 1
  application: {
    name: string
  }
  database: {
    schemaVersion: 4 | 5
  }
  createdAt: string
  data: BackupData
}

export function validateBackupEnvelope(
  envelope: unknown,
): asserts envelope is BackupEnvelope {
  if (!envelope || typeof envelope !== 'object') {
    throw new DomainValidationError('Backup must be a JSON object')
  }

  const env = envelope as Record<string, unknown>
  if (env.formatVersion !== 1) {
    throw new DomainValidationError(
      `Unsupported backup format version: ${env.formatVersion}`,
    )
  }

  const db = env.database as Record<string, unknown> | undefined
  if (db?.schemaVersion !== 4 && db?.schemaVersion !== 5) {
    throw new DomainValidationError(
      `Unsupported database schema version: ${db?.schemaVersion}`,
    )
  }

  const app = env.application as Record<string, unknown> | undefined
  if (typeof app?.name !== 'string' || !app.name.trim()) {
    throw new DomainValidationError('Backup application name is missing')
  }

  if (
    typeof env.createdAt !== 'string' ||
    Number.isNaN(Date.parse(env.createdAt))
  ) {
    throw new DomainValidationError('Backup creation timestamp is invalid')
  }

  if (!env.data || typeof env.data !== 'object') {
    throw new DomainValidationError('Backup data is missing')
  }
}

export function validateBackupData(data: BackupData): void {
  data.goals = data.goals || []
  if (!Array.isArray(data.studentProfiles))
    throw new DomainValidationError('studentProfiles must be an array')
  if (!Array.isArray(data.academicPrograms))
    throw new DomainValidationError('academicPrograms must be an array')
  if (!Array.isArray(data.academicYears))
    throw new DomainValidationError('academicYears must be an array')
  if (!Array.isArray(data.semesters))
    throw new DomainValidationError('semesters must be an array')
  if (!Array.isArray(data.subjects))
    throw new DomainValidationError('subjects must be an array')
  if (!Array.isArray(data.enrollments))
    throw new DomainValidationError('enrollments must be an array')
  if (!Array.isArray(data.grades))
    throw new DomainValidationError('grades must be an array')
  if (!Array.isArray(data.tasks))
    throw new DomainValidationError('tasks must be an array')
  if (!Array.isArray(data.academicEvents))
    throw new DomainValidationError('academicEvents must be an array')
  if (!Array.isArray(data.goals))
    throw new DomainValidationError('goals must be an array')

  data.studentProfiles.forEach((profile) => {
    try {
      validateStudentProfile(profile)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid student profile ${profile.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.academicPrograms.forEach((program) => {
    try {
      validateAcademicProgram(program)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid academic program ${program.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.academicYears.forEach((year) => {
    try {
      validateAcademicYear(year)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid academic year ${year.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.semesters.forEach((semester) => {
    try {
      validateSemester(semester)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid semester ${semester.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.subjects.forEach((subject) => {
    try {
      validateSubject(subject)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid subject ${subject.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.enrollments.forEach((enrollment) => {
    try {
      validateEnrollment(enrollment)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid enrollment ${enrollment.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.grades.forEach((grade) => {
    try {
      validateGrade(grade)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid grade ${grade.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.tasks.forEach((task) => {
    try {
      validateTask(task)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid task ${task.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.academicEvents.forEach((event) => {
    try {
      validateAcademicEvent(event)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid academic event ${event.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })

  data.goals.forEach((goal) => {
    try {
      validateAcademicGoal(goal)
    } catch (e) {
      throw new DomainValidationError(
        `Invalid academic goal ${goal.id}: ${e instanceof Error ? e.message : 'Unknown error'}`,
      )
    }
  })
}

export function validateCrossReferences(data: BackupData): void {
  const academicProgramIds = new Set(data.academicPrograms.map((p) => p.id))
  const academicYearIds = new Set(data.academicYears.map((y) => y.id))
  const semesterIds = new Set(data.semesters.map((s) => s.id))
  const subjectIds = new Set(data.subjects.map((s) => s.id))
  const enrollmentIds = new Set(data.enrollments.map((e) => e.id))

  data.semesters.forEach((semester) => {
    if (!academicYearIds.has(semester.academicYearId)) {
      throw new DomainValidationError(
        `Semester ${semester.id} references missing academic year ${semester.academicYearId}`,
      )
    }
  })

  data.subjects.forEach((subject) => {
    if (
      subject.academicProgramId &&
      !academicProgramIds.has(subject.academicProgramId)
    ) {
      throw new DomainValidationError(
        `Subject ${subject.id} references missing academic program ${subject.academicProgramId}`,
      )
    }
  })

  data.enrollments.forEach((enrollment) => {
    if (!subjectIds.has(enrollment.subjectId)) {
      throw new DomainValidationError(
        `Enrollment ${enrollment.id} references missing subject ${enrollment.subjectId}`,
      )
    }
    if (!semesterIds.has(enrollment.semesterId)) {
      throw new DomainValidationError(
        `Enrollment ${enrollment.id} references missing semester ${enrollment.semesterId}`,
      )
    }
  })

  data.grades.forEach((grade) => {
    if (!enrollmentIds.has(grade.enrollmentId)) {
      throw new DomainValidationError(
        `Grade ${grade.id} references missing enrollment ${grade.enrollmentId}`,
      )
    }
  })

  data.tasks.forEach((task) => {
    if (task.subjectId && !subjectIds.has(task.subjectId)) {
      throw new DomainValidationError(
        `Task ${task.id} references missing subject ${task.subjectId}`,
      )
    }
  })

  data.academicEvents.forEach((event) => {
    if (event.subjectId && !subjectIds.has(event.subjectId)) {
      throw new DomainValidationError(
        `Academic event ${event.id} references missing subject ${event.subjectId}`,
      )
    }
  })

  data.goals.forEach((goal) => {
    if (
      goal.academicProgramId &&
      !academicProgramIds.has(goal.academicProgramId)
    ) {
      throw new DomainValidationError(
        `Academic goal ${goal.id} references missing academic program ${goal.academicProgramId}`,
      )
    }
  })
}

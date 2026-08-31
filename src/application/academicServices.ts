import {
  DomainValidationError,
  validateAcademicProgram,
  validateAcademicYear,
  validateEnrollment,
  validateGrade,
  validateSemester,
  validateStudentProfile,
  validateSubject,
} from '../domain'
import type {
  AcademicProgram,
  AcademicYear,
  Enrollment,
  Grade,
  Semester,
  StudentProfile,
  Subject,
} from '../domain'
import type { AnalyticsRepositories } from './analytics'
import type { PlannerRepositories } from './planner'

export class AcademicService {
  constructor(
    private readonly academicRepos: AnalyticsRepositories,
    private readonly plannerRepos: PlannerRepositories,
  ) {}

  // --- Student Profile ---
  async saveProfile(profile: StudentProfile): Promise<void> {
    validateStudentProfile(profile)
    await this.academicRepos.profiles.save(profile)
  }

  // --- Academic Program ---
  async saveProgram(program: AcademicProgram): Promise<void> {
    validateAcademicProgram(program)
    const existing = await this.academicRepos.programs.list()
    const duplicate = existing.find(
      (p) =>
        p.id !== program.id &&
        p.name.toLowerCase() === program.name.toLowerCase(),
    )
    if (duplicate) {
      throw new DomainValidationError(
        'An academic program with this name already exists',
      )
    }
    await this.academicRepos.programs.save(program)
  }

  async deleteProgram(id: string): Promise<void> {
    const subjects = await this.academicRepos.subjects.list()
    if (subjects.some((s) => s.academicProgramId === id)) {
      throw new DomainValidationError(
        'Cannot delete program because it is referenced by one or more subjects',
      )
    }
    await this.academicRepos.programs.delete(id)
  }

  // --- Academic Year ---
  async saveYear(year: AcademicYear): Promise<void> {
    validateAcademicYear(year)
    const existing = await this.academicRepos.years.list()
    const duplicate = existing.find(
      (y) =>
        y.id !== year.id && y.label.toLowerCase() === year.label.toLowerCase(),
    )
    if (duplicate) {
      throw new DomainValidationError(
        'An academic year with this label already exists',
      )
    }
    await this.academicRepos.years.save(year)
  }

  async deleteYear(id: string): Promise<void> {
    const semesters = await this.academicRepos.semesters.list()
    if (semesters.some((s) => s.academicYearId === id)) {
      throw new DomainValidationError(
        'Cannot delete academic year because it is referenced by one or more semesters',
      )
    }
    await this.academicRepos.years.delete(id)
  }

  // --- Semester ---
  async saveSemester(semester: Semester): Promise<void> {
    validateSemester(semester)
    const existing = await this.academicRepos.semesters.list()
    const duplicate = existing.find(
      (s) =>
        s.id !== semester.id &&
        s.academicYearId === semester.academicYearId &&
        s.name.toLowerCase() === semester.name.toLowerCase(),
    )
    if (duplicate) {
      throw new DomainValidationError(
        'A semester with this name already exists in the academic year',
      )
    }
    await this.academicRepos.semesters.save(semester)
  }

  async deleteSemester(id: string): Promise<void> {
    const enrollments = await this.academicRepos.enrollments.list()
    if (enrollments.some((e) => e.semesterId === id)) {
      throw new DomainValidationError(
        'Cannot delete semester because it is referenced by one or more enrollments',
      )
    }
    await this.academicRepos.semesters.delete(id)
  }

  // --- Subject ---
  async saveSubject(subject: Subject): Promise<void> {
    validateSubject(subject)
    const existing = await this.academicRepos.subjects.list()
    const duplicate = existing.find((s) => {
      if (s.id === subject.id) return false
      if (s.name.toLowerCase() === subject.name.toLowerCase()) return true
      if (
        subject.code &&
        s.code &&
        s.code.toLowerCase() === subject.code.toLowerCase()
      )
        return true
      return false
    })
    if (duplicate) {
      throw new DomainValidationError(
        'A subject with this name or code already exists',
      )
    }
    await this.academicRepos.subjects.save(subject)
  }

  async archiveSubject(id: string): Promise<void> {
    const subject = await this.academicRepos.subjects.get(id)
    if (!subject) throw new DomainValidationError('Subject not found')
    subject.archived = true
    await this.academicRepos.subjects.save(subject)
  }

  async deleteSubject(id: string): Promise<void> {
    const enrollments = await this.academicRepos.enrollments.list()
    if (enrollments.some((e) => e.subjectId === id)) {
      throw new DomainValidationError(
        'Cannot delete subject because it is referenced by one or more enrollments',
      )
    }
    const tasks = await this.plannerRepos.tasks.list()
    if (tasks.some((t) => t.subjectId === id)) {
      throw new DomainValidationError(
        'Cannot delete subject because it is referenced by one or more tasks',
      )
    }
    const events = await this.plannerRepos.events.list()
    if (events.some((e) => e.subjectId === id)) {
      throw new DomainValidationError(
        'Cannot delete subject because it is referenced by one or more events',
      )
    }
    await this.academicRepos.subjects.delete(id)
  }

  // --- Enrollment ---
  async saveEnrollment(enrollment: Enrollment): Promise<void> {
    validateEnrollment(enrollment)
    const existing = await this.academicRepos.enrollments.list()
    const duplicate = existing.find(
      (e) =>
        e.id !== enrollment.id &&
        e.subjectId === enrollment.subjectId &&
        e.semesterId === enrollment.semesterId,
    )
    if (duplicate) {
      throw new DomainValidationError(
        'An enrollment for this subject and semester already exists',
      )
    }

    // Check if subject is archived (prevent new enrollments)
    const isNew = !existing.some((e) => e.id === enrollment.id)
    if (isNew) {
      const subject = await this.academicRepos.subjects.get(
        enrollment.subjectId,
      )
      if (subject?.archived) {
        throw new DomainValidationError(
          'Cannot create a new enrollment for an archived subject',
        )
      }
    }

    await this.academicRepos.enrollments.save(enrollment)
  }

  async deleteEnrollment(id: string): Promise<void> {
    const grades = await this.academicRepos.grades.list()
    if (grades.some((g) => g.enrollmentId === id)) {
      throw new DomainValidationError(
        'Cannot delete enrollment because it has an associated grade',
      )
    }
    await this.academicRepos.enrollments.delete(id)
  }

  // --- Grade ---
  async saveGrade(grade: Grade): Promise<void> {
    validateGrade(grade)
    await this.academicRepos.grades.save(grade)
  }

  async deleteGrade(id: string): Promise<void> {
    await this.academicRepos.grades.delete(id)
  }
}

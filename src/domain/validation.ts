import type {
  AcademicProgram,
  AcademicYear,
  Enrollment,
  Grade,
  Semester,
  StudentProfile,
  Subject,
} from './academic'

export class DomainValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainValidationError'
  }
}

function requireText(value: string | undefined, fieldName: string): void {
  if (!value?.trim()) {
    throw new DomainValidationError(`${fieldName} is required`)
  }
}

function requireId(value: string, fieldName: string): void {
  requireText(value, fieldName)
}

function requireNonNegative(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new DomainValidationError(
      `${fieldName} must be a non-negative number`,
    )
  }
}

function validateDate(value: string | undefined, fieldName: string): void {
  if (value !== undefined && Number.isNaN(Date.parse(value))) {
    throw new DomainValidationError(`${fieldName} must be a valid date`)
  }
}

export function validateStudentProfile(profile: StudentProfile): void {
  requireId(profile.id, 'Student profile id')
  requireText(profile.name, 'Student profile name')
}

export function validateAcademicProgram(program: AcademicProgram): void {
  requireId(program.id, 'Academic program id')
  requireText(program.name, 'Academic program name')
  if (program.totalRequiredCredits !== undefined) {
    requireNonNegative(program.totalRequiredCredits, 'Total required credits')
  }
}

export function validateAcademicYear(year: AcademicYear): void {
  requireId(year.id, 'Academic year id')
  requireText(year.label, 'Academic year label')
}

export function validateSemester(semester: Semester): void {
  requireId(semester.id, 'Semester id')
  requireId(semester.academicYearId, 'Academic year id')
  requireText(semester.name, 'Semester name')
  validateDate(semester.startDate, 'Semester start date')
  validateDate(semester.endDate, 'Semester end date')
}

export function validateSubject(subject: Subject): void {
  requireId(subject.id, 'Subject id')
  requireText(subject.name, 'Subject name')
  requireNonNegative(subject.credits, 'Subject credits')
}

export function validateEnrollment(enrollment: Enrollment): void {
  requireId(enrollment.id, 'Enrollment id')
  requireId(enrollment.subjectId, 'Subject id')
  requireId(enrollment.semesterId, 'Semester id')
  if (
    enrollment.attemptNumber !== undefined &&
    (!Number.isInteger(enrollment.attemptNumber) ||
      enrollment.attemptNumber < 1)
  ) {
    throw new DomainValidationError('Attempt number must be a positive integer')
  }
}

export function validateGrade(grade: Grade): void {
  requireId(grade.id, 'Grade id')
  requireId(grade.enrollmentId, 'Enrollment id')
  requireText(grade.value, 'Grade value')
  if (
    grade.numericGrade !== undefined &&
    !Number.isFinite(grade.numericGrade)
  ) {
    throw new DomainValidationError('Numeric grade must be a finite number')
  }
}

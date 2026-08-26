import type {
  AcademicProgram,
  Enrollment,
  Grade,
  Semester,
  Subject,
} from './academic'
import { convertCourseScore } from './grading'

export type AnalyticsStatus =
  'Available' | 'Incomplete' | 'Unavailable' | 'Data integrity issue'

export interface CalculatedGpaResult {
  status: AnalyticsStatus
  value?: number
  weightedPoints: number
  credits: number
  qualifyingSubjects: number
  missingGradeEnrollmentIds: string[]
  ambiguousGradeEnrollmentIds: string[]
  invalidGradeEnrollmentIds: string[]
  invalidCreditEnrollmentIds: string[]
  repeatedSubjectIds: string[]
  repeatedEnrollmentIds: string[]
}

export interface CreditProgress {
  status: AnalyticsStatus
  attemptedCredits: number
  completedCredits: number
  remainingCredits?: number
  completionPercentage?: number
}

export interface SemesterPerformance {
  semester: Semester
  gpa: CalculatedGpaResult
  attemptedCredits: number
  completedCredits: number
  completedSubjectCount: number
  failedSubjectCount: number
}

export interface SubjectPerformance {
  subject: Subject
  semester: Semester
  enrollment: Enrollment
  grade?: Grade
  status: AnalyticsStatus
}

export interface AcademicTrendPoint {
  semesterId: string
  semesterLabel: string
  gpa: CalculatedGpaResult
  accumulatedCompletedCredits: number
}

export interface AcademicTrends {
  status: AnalyticsStatus
  points: AcademicTrendPoint[]
}

interface AcademicRecord {
  enrollment: Enrollment
  subject: Subject
  semester: Semester
  grades: Grade[]
}

const terminalStatuses = new Set<Enrollment['status']>(['completed'])
const officialLetterGrades = new Set([
  'A+',
  'A',
  'B+',
  'B',
  'C+',
  'C',
  'D+',
  'D',
  'F',
])

function recordsForSemester(
  records: AcademicRecord[],
  semesterId: string,
): AcademicRecord[] {
  return records.filter((record) => record.enrollment.semesterId === semesterId)
}

function gradeFor(record: AcademicRecord): Grade | undefined {
  if (record.grades.length !== 1) return undefined
  return record.grades[0]
}

function isUsableGrade(
  grade: Grade | undefined,
): grade is Grade & { letterGrade: string; fourPointValue: number } {
  const fourPointValue = grade?.fourPointValue
  return Boolean(
    grade?.finalized &&
    grade.letterGrade &&
    officialLetterGrades.has(grade.letterGrade) &&
    typeof fourPointValue === 'number' &&
    Number.isFinite(fourPointValue) &&
    fourPointValue >= 0 &&
    fourPointValue <= 4,
  )
}

function gpaForRecords(records: AcademicRecord[]): CalculatedGpaResult {
  const missingGradeEnrollmentIds: string[] = []
  const ambiguousGradeEnrollmentIds: string[] = []
  const invalidGradeEnrollmentIds: string[] = []
  const invalidCreditEnrollmentIds: string[] = []
  let weightedPoints = 0
  let credits = 0
  let qualifyingSubjects = 0

  for (const record of records) {
    if (!terminalStatuses.has(record.enrollment.status)) continue
    if (record.grades.length > 1) {
      ambiguousGradeEnrollmentIds.push(record.enrollment.id)
      continue
    }
    const grade = gradeFor(record)
    if (!grade || !grade.finalized) {
      missingGradeEnrollmentIds.push(record.enrollment.id)
      continue
    }
    if (!isUsableGrade(grade)) {
      invalidGradeEnrollmentIds.push(record.enrollment.id)
      continue
    }
    if (grade.originalScore !== undefined) {
      try {
        const conversion = convertCourseScore(grade.originalScore)
        if (
          conversion.letterGrade !== grade.letterGrade ||
          conversion.fourPointValue !== grade.fourPointValue
        ) {
          invalidGradeEnrollmentIds.push(record.enrollment.id)
          continue
        }
      } catch {
        invalidGradeEnrollmentIds.push(record.enrollment.id)
        continue
      }
    }
    if (
      !Number.isFinite(record.subject.credits) ||
      record.subject.credits <= 0
    ) {
      invalidCreditEnrollmentIds.push(record.enrollment.id)
      continue
    }
    weightedPoints += grade.fourPointValue * record.subject.credits
    credits += record.subject.credits
    qualifyingSubjects += 1
  }

  const status: AnalyticsStatus =
    ambiguousGradeEnrollmentIds.length > 0 ||
    invalidGradeEnrollmentIds.length > 0 ||
    invalidCreditEnrollmentIds.length > 0
      ? 'Data integrity issue'
      : missingGradeEnrollmentIds.length > 0
        ? 'Incomplete'
        : credits > 0
          ? 'Available'
          : 'Unavailable'

  return {
    status,
    value: status === 'Available' ? weightedPoints / credits : undefined,
    weightedPoints,
    credits,
    qualifyingSubjects,
    missingGradeEnrollmentIds,
    ambiguousGradeEnrollmentIds,
    invalidGradeEnrollmentIds,
    invalidCreditEnrollmentIds,
    repeatedSubjectIds: [],
    repeatedEnrollmentIds: [],
  }
}

export function calculateSemesterGpa(
  records: AcademicRecord[],
  semesterId: string,
): CalculatedGpaResult {
  return gpaForRecords(recordsForSemester(records, semesterId))
}

export function calculateCumulativeGpa(
  records: AcademicRecord[],
): CalculatedGpaResult {
  const repeatedSubjectIds = new Set(
    records
      .filter((record) => terminalStatuses.has(record.enrollment.status))
      .map((record) => record.subject.id),
  )
  const repeated = [...repeatedSubjectIds].filter(
    (subjectId) =>
      records.filter(
        (record) =>
          record.subject.id === subjectId &&
          terminalStatuses.has(record.enrollment.status),
      ).length > 1,
  )
  const result = gpaForRecords(records)
  return repeated.length > 0
    ? {
        ...result,
        status:
          result.status === 'Data integrity issue'
            ? result.status
            : 'Incomplete',
        value: undefined,
        repeatedSubjectIds: repeated,
        repeatedEnrollmentIds: records
          .filter((record) => repeated.includes(record.subject.id))
          .map((record) => record.enrollment.id),
      }
    : result
}

export function calculateCreditProgress(
  records: AcademicRecord[],
  program?: AcademicProgram,
): CreditProgress {
  let attemptedCredits = 0
  let completedCredits = 0
  let hasAmbiguousGrades = false
  let hasInvalidCredits = false
  for (const record of records) {
    if (!terminalStatuses.has(record.enrollment.status)) continue
    if (
      !Number.isFinite(record.subject.credits) ||
      record.subject.credits <= 0
    ) {
      hasInvalidCredits = true
      continue
    }
    if (record.grades.length > 1) {
      hasAmbiguousGrades = true
      continue
    }
    const grade = gradeFor(record)
    if (!isUsableGrade(grade)) continue
    attemptedCredits += record.subject.credits
    if (grade.letterGrade !== 'F') completedCredits += record.subject.credits
  }
  if (program?.totalRequiredCredits === undefined) {
    return {
      status:
        hasAmbiguousGrades || hasInvalidCredits
          ? 'Data integrity issue'
          : 'Unavailable',
      attemptedCredits,
      completedCredits,
    }
  }
  const remainingCredits = Math.max(
    program.totalRequiredCredits - completedCredits,
    0,
  )
  return {
    status:
      hasAmbiguousGrades || hasInvalidCredits
        ? 'Data integrity issue'
        : 'Available',
    attemptedCredits,
    completedCredits,
    remainingCredits,
    completionPercentage:
      program.totalRequiredCredits === 0
        ? 0
        : Math.min(
            (completedCredits / program.totalRequiredCredits) * 100,
            100,
          ),
  }
}

export function calculateSemesterPerformance(
  records: AcademicRecord[],
  semester: Semester,
): SemesterPerformance {
  const semesterRecords = recordsForSemester(records, semester.id)
  const terminal = semesterRecords.filter((record) =>
    terminalStatuses.has(record.enrollment.status),
  )
  const finalized = terminal.filter((record) => {
    const grade = gradeFor(record)
    return (
      isUsableGrade(grade) &&
      Number.isFinite(record.subject.credits) &&
      record.subject.credits > 0
    )
  })
  return {
    semester,
    gpa: calculateSemesterGpa(records, semester.id),
    attemptedCredits: finalized.reduce(
      (total, record) => total + record.subject.credits,
      0,
    ),
    completedCredits: finalized.reduce(
      (total, record) =>
        total +
        (gradeFor(record)?.letterGrade === 'F' ? 0 : record.subject.credits),
      0,
    ),
    completedSubjectCount: finalized.filter(
      (record) => gradeFor(record)?.letterGrade !== 'F',
    ).length,
    failedSubjectCount: finalized.filter(
      (record) => gradeFor(record)?.letterGrade === 'F',
    ).length,
  }
}

export function calculateSubjectPerformance(
  records: AcademicRecord[],
): SubjectPerformance[] {
  return records.map((record) => ({
    subject: record.subject,
    semester: record.semester,
    enrollment: record.enrollment,
    grade: gradeFor(record),
    status:
      record.enrollment.status !== 'completed'
        ? 'Unavailable'
        : record.grades.length > 1
          ? 'Data integrity issue'
          : !gradeFor(record)?.finalized
            ? 'Incomplete'
            : !isUsableGrade(gradeFor(record))
              ? 'Data integrity issue'
              : 'Available',
  }))
}

export function calculateTrends(
  records: AcademicRecord[],
  semesters: Semester[],
): AcademicTrends {
  if (semesters.some((semester) => !semester.startDate)) {
    return { status: 'Unavailable', points: [] }
  }
  const ordered = [...semesters].sort((left, right) => {
    return Date.parse(left.startDate!) - Date.parse(right.startDate!)
  })
  if (
    ordered.some(
      (semester, index) =>
        Number.isNaN(Date.parse(semester.startDate!)) ||
        (index > 0 &&
          Date.parse(semester.startDate!) ===
            Date.parse(ordered[index - 1].startDate!)),
    )
  ) {
    return { status: 'Unavailable', points: [] }
  }
  let accumulatedCompletedCredits = 0
  return {
    status: 'Available',
    points: ordered.map((semester) => {
      const performance = calculateSemesterPerformance(records, semester)
      accumulatedCompletedCredits += performance.completedCredits
      return {
        semesterId: semester.id,
        semesterLabel: semester.name,
        gpa: performance.gpa,
        accumulatedCompletedCredits,
      }
    }),
  }
}

export type { AcademicRecord }

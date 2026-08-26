import type {
  AcademicProgramRepository,
  AcademicYearRepository,
  EnrollmentRepository,
  GradeRepository,
  SemesterRepository,
  StudentProfileRepository,
  SubjectRepository,
} from './ports/academicRepositories'
import {
  calculateCreditProgress,
  calculateCumulativeGpa,
  calculateSemesterPerformance,
  calculateSubjectPerformance,
  calculateTrends,
  type AcademicRecord,
  type AcademicTrends,
  type CreditProgress,
  type CalculatedGpaResult,
  type SemesterPerformance,
  type SubjectPerformance,
} from '../domain'
import type { AcademicProgram, Semester, StudentProfile } from '../domain'

export interface AnalyticsRepositories {
  profiles: StudentProfileRepository
  programs: AcademicProgramRepository
  years: AcademicYearRepository
  semesters: SemesterRepository
  subjects: SubjectRepository
  enrollments: EnrollmentRepository
  grades: GradeRepository
}

export interface DashboardSummary {
  profile?: StudentProfile
  program?: AcademicProgram
  calculatedGpa: CalculatedGpaResult
  creditProgress: CreditProgress
  currentSemester?: Semester
  semesterPerformance: SemesterPerformance[]
  subjectPerformance: SubjectPerformance[]
  trends: AcademicTrends
  integrityIssueRecordIds: string[]
  sourceRecords: {
    profiles: StudentProfile[]
    programs: AcademicProgram[]
    years: Awaited<ReturnType<AcademicYearRepository['list']>>
    semesters: Awaited<ReturnType<SemesterRepository['list']>>
    subjects: Awaited<ReturnType<SubjectRepository['list']>>
    enrollments: Awaited<ReturnType<EnrollmentRepository['list']>>
    grades: Awaited<ReturnType<GradeRepository['list']>>
  }
}

async function loadRecords(repositories: AnalyticsRepositories) {
  const [profiles, programs, years, enrollments, subjects, semesters, grades] =
    await Promise.all([
      repositories.profiles.list(),
      repositories.programs.list(),
      repositories.years.list(),
      repositories.enrollments.list(),
      repositories.subjects.list(),
      repositories.semesters.list(),
      repositories.grades.list(),
    ])
  const subjectsById = new Map(subjects.map((subject) => [subject.id, subject]))
  const semestersById = new Map(
    semesters.map((semester) => [semester.id, semester]),
  )
  const gradesByEnrollment = new Map<string, typeof grades>()
  for (const grade of grades) {
    const enrollmentGrades = gradesByEnrollment.get(grade.enrollmentId) ?? []
    enrollmentGrades.push(grade)
    gradesByEnrollment.set(grade.enrollmentId, enrollmentGrades)
  }
  const integrityIssueRecordIds = [
    ...enrollments
      .filter(
        (enrollment) =>
          !subjectsById.has(enrollment.subjectId) ||
          !semestersById.has(enrollment.semesterId),
      )
      .map((enrollment) => enrollment.id),
    ...grades
      .filter(
        (grade) =>
          !enrollments.some(
            (enrollment) => enrollment.id === grade.enrollmentId,
          ),
      )
      .map((grade) => grade.id),
  ]
  return {
    profiles,
    programs,
    years,
    enrollments,
    subjects,
    semesters,
    grades,
    records: enrollments.flatMap((enrollment) => {
      const subject = subjectsById.get(enrollment.subjectId)
      const semester = semestersById.get(enrollment.semesterId)
      return subject && semester
        ? [
            {
              enrollment,
              subject,
              semester,
              grades: gradesByEnrollment.get(enrollment.id) ?? [],
            } satisfies AcademicRecord,
          ]
        : []
    }),
    integrityIssueRecordIds,
  }
}

export async function getDashboardSummary(
  repositories: AnalyticsRepositories,
): Promise<DashboardSummary> {
  const {
    records,
    semesters,
    integrityIssueRecordIds,
    profiles,
    programs,
    years,
    subjects,
    enrollments,
    grades,
  } = await loadRecords(repositories)
  const currentSemester = semesters.find(
    (semester) => semester.status === 'active',
  )
  const calculatedGpa = calculateCumulativeGpa(records)
  const semesterPerformance = semesters.map((semester) =>
    calculateSemesterPerformance(records, semester),
  )
  return {
    profile: profiles[0],
    program: programs[0],
    calculatedGpa:
      integrityIssueRecordIds.length > 0
        ? { ...calculatedGpa, status: 'Data integrity issue' }
        : calculatedGpa,
    creditProgress: calculateCreditProgress(records, programs[0]),
    currentSemester,
    semesterPerformance,
    subjectPerformance: calculateSubjectPerformance(records),
    trends: calculateTrends(records, semesters),
    integrityIssueRecordIds,
    sourceRecords: {
      profiles,
      programs,
      years,
      semesters,
      subjects,
      enrollments,
      grades,
    },
  }
}

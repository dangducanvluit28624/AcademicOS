export type EntityId = string
export type IsoDate = string

export type AcademicStatus = 'planned' | 'active' | 'completed' | 'archived'
export type EnrollmentStatus =
  'planned' | 'in-progress' | 'completed' | 'dropped' | 'deferred'

export interface StudentProfile {
  id: EntityId
  name: string
  studentIdentifier?: string
  university?: string
  faculty?: string
  major?: string
  expectedGraduationPeriod?: string
  academicStatus?: string
  overallGpa?: number
}

export interface AcademicProgram {
  id: EntityId
  name: string
  major?: string
  totalRequiredCredits?: number
  programVersion?: string
  archived?: boolean
}

export interface AcademicYear {
  id: EntityId
  label: string
}

export interface Semester {
  id: EntityId
  academicYearId: EntityId
  name: string
  startDate?: IsoDate
  endDate?: IsoDate
  status: AcademicStatus
}

export interface Subject {
  id: EntityId
  code?: string
  name: string
  credits: number
  subjectType?: string
  description?: string
  prerequisiteSubjectIds?: EntityId[]
  academicProgramId?: EntityId
  archived?: boolean
}

export interface Enrollment {
  id: EntityId
  subjectId: EntityId
  semesterId: EntityId
  status: EnrollmentStatus
  attemptNumber?: number
  gradeId?: EntityId
  notes?: string
}

export interface Grade {
  id: EntityId
  enrollmentId: EntityId
  value: string
  scale?: string
  letterGrade?: string
  numericGrade?: number
  originalScore?: number
  fourPointValue?: number
  status?: string
  finalized: boolean
}

export type AcademicEntity =
  | StudentProfile
  | AcademicProgram
  | AcademicYear
  | Semester
  | Subject
  | Enrollment
  | Grade

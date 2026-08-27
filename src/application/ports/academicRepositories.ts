import type {
  AcademicProgram,
  AcademicYear,
  Enrollment,
  Grade,
  Semester,
  StudentProfile,
  Subject,
} from '../../domain'

export interface StudentProfileRepository {
  get(id: string): Promise<StudentProfile | undefined>
  list(): Promise<StudentProfile[]>
  save(profile: StudentProfile): Promise<void>
}

export interface AcademicProgramRepository {
  get(id: string): Promise<AcademicProgram | undefined>
  list(): Promise<AcademicProgram[]>
  save(program: AcademicProgram): Promise<void>
}

export interface AcademicYearRepository {
  get(id: string): Promise<AcademicYear | undefined>
  list(): Promise<AcademicYear[]>
  save(year: AcademicYear): Promise<void>
}

export interface SemesterRepository {
  get(id: string): Promise<Semester | undefined>
  list(): Promise<Semester[]>
  save(semester: Semester): Promise<void>
}

export interface SubjectRepository {
  get(id: string): Promise<Subject | undefined>
  list(): Promise<Subject[]>
  save(subject: Subject): Promise<void>
}

export interface EnrollmentRepository {
  get(id: string): Promise<Enrollment | undefined>
  list(): Promise<Enrollment[]>
  save(enrollment: Enrollment): Promise<void>
}

export interface GradeRepository {
  get(id: string): Promise<Grade | undefined>
  list(): Promise<Grade[]>
  save(grade: Grade): Promise<void>
}

import type { AcademicEvent, Task } from '../../domain'

export interface TaskRepository {
  get(id: string): Promise<Task | undefined>
  list(): Promise<Task[]>
  save(task: Task): Promise<void>
}

export interface AcademicEventRepository {
  get(id: string): Promise<AcademicEvent | undefined>
  list(): Promise<AcademicEvent[]>
  save(event: AcademicEvent): Promise<void>
}

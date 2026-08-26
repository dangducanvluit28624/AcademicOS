import { useEffect, useState, type FormEvent } from 'react'
import { convertCourseScore } from '../../domain'
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
  IndexedDbAcademicProgramRepository,
  IndexedDbAcademicYearRepository,
  IndexedDbEnrollmentRepository,
  IndexedDbGradeRepository,
  IndexedDbSemesterRepository,
  IndexedDbStudentProfileRepository,
  IndexedDbSubjectRepository,
} from '../../infrastructure/persistence/academicRepositories'
import { IndexedDbDatabase } from '../../infrastructure/persistence/indexedDbDatabase'

const database = new IndexedDbDatabase()
const profiles = new IndexedDbStudentProfileRepository(database)
const programs = new IndexedDbAcademicProgramRepository(database)
const years = new IndexedDbAcademicYearRepository(database)
const semesters = new IndexedDbSemesterRepository(database)
const subjects = new IndexedDbSubjectRepository(database)
const enrollments = new IndexedDbEnrollmentRepository(database)
const grades = new IndexedDbGradeRepository(database)

const id = () => crypto.randomUUID()

export function App() {
  const [profile, setProfile] = useState<StudentProfile>({
    id: 'student-profile',
    name: '',
    overallGpa: undefined,
  })
  const [program, setProgram] = useState<AcademicProgram>({ id: '', name: '' })
  const [year, setYear] = useState<AcademicYear>({ id: '', label: '' })
  const [semester, setSemester] = useState<Semester>({
    id: '',
    academicYearId: '',
    name: '',
    status: 'planned',
  })
  const [subject, setSubject] = useState<Subject>({
    id: '',
    name: '',
    credits: 0,
  })
  const [enrollment, setEnrollment] = useState<Enrollment>({
    id: '',
    subjectId: '',
    semesterId: '',
    status: 'planned',
  })
  const [grade, setGrade] = useState<Grade>({
    id: '',
    enrollmentId: '',
    value: '',
    finalized: false,
  })
  const [records, setRecords] = useState({
    profiles: [] as StudentProfile[],
    programs: [] as AcademicProgram[],
    years: [] as AcademicYear[],
    semesters: [] as Semester[],
    subjects: [] as Subject[],
    enrollments: [] as Enrollment[],
    grades: [] as Grade[],
  })
  const [message, setMessage] = useState('')

  async function reload() {
    setRecords({
      profiles: await profiles.list(),
      programs: await programs.list(),
      years: await years.list(),
      semesters: await semesters.list(),
      subjects: await subjects.list(),
      enrollments: await enrollments.list(),
      grades: await grades.list(),
    })
  }

  useEffect(() => {
    void reload()
  }, [])

  async function save(event: FormEvent, action: () => Promise<void>) {
    event.preventDefault()
    try {
      await action()
      await reload()
      setMessage('Saved')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save')
    }
  }

  const score = grade.originalScore
  const conversion = score === undefined ? undefined : convertCourseScore(score)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <header>
        <p>ACADEMIC OS / M2</p>
        <h1>Academic OS</h1>
        <h2>Academic record workspace</h2>
        <p>
          Persist your academic history locally, with official course conversion
          and user-provided GPA.
        </p>
        <strong role="status">{message}</strong>
      </header>

      <section>
        <h2>Student profile</h2>
        <form
          onSubmit={(event) => void save(event, () => profiles.save(profile))}
        >
          <input
            aria-label="Student name"
            placeholder="Name"
            value={profile.name}
            onChange={(event) =>
              setProfile({ ...profile, name: event.target.value })
            }
            required
          />
          <input
            aria-label="Overall GPA"
            type="number"
            min="0"
            max="4"
            step="0.01"
            placeholder="Overall GPA"
            value={profile.overallGpa ?? ''}
            onChange={(event) =>
              setProfile({
                ...profile,
                overallGpa: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
          />
          <button type="submit">Save profile</button>
        </form>
        <p>
          Overall GPA:{' '}
          {records.profiles.find((item) => item.id === profile.id)
            ?.overallGpa ?? 'Not provided'}
        </p>
      </section>

      <section>
        <h2>Academic structure</h2>
        <form
          onSubmit={(event) =>
            void save(event, () =>
              programs.save({ ...program, id: program.id || id() }),
            )
          }
        >
          <input
            aria-label="Program name"
            placeholder="Program"
            value={program.name}
            onChange={(event) =>
              setProgram({ ...program, name: event.target.value })
            }
            required
          />
          <button type="submit">Save program</button>
        </form>
        <form
          onSubmit={(event) =>
            void save(event, () => years.save({ ...year, id: year.id || id() }))
          }
        >
          <input
            aria-label="Academic year"
            placeholder="Academic year"
            value={year.label}
            onChange={(event) =>
              setYear({ ...year, label: event.target.value })
            }
            required
          />
          <button type="submit">Save year</button>
        </form>
        <form
          onSubmit={(event) =>
            void save(event, () =>
              semesters.save({ ...semester, id: semester.id || id() }),
            )
          }
        >
          <input
            aria-label="Semester name"
            placeholder="Semester"
            value={semester.name}
            onChange={(event) =>
              setSemester({ ...semester, name: event.target.value })
            }
            required
          />
          <select
            aria-label="Semester year"
            value={semester.academicYearId}
            onChange={(event) =>
              setSemester({ ...semester, academicYearId: event.target.value })
            }
            required
          >
            <option value="">Select year</option>
            {records.years.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Semester status"
            value={semester.status}
            onChange={(event) =>
              setSemester({
                ...semester,
                status: event.target.value as Semester['status'],
              })
            }
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <button type="submit">Save semester</button>
        </form>
      </section>

      <section>
        <h2>Subjects and enrollment</h2>
        <form
          onSubmit={(event) =>
            void save(event, () =>
              subjects.save({ ...subject, id: subject.id || id() }),
            )
          }
        >
          <input
            aria-label="Subject name"
            placeholder="Subject"
            value={subject.name}
            onChange={(event) =>
              setSubject({ ...subject, name: event.target.value })
            }
            required
          />
          <input
            aria-label="Subject credits"
            type="number"
            min="0"
            step="0.5"
            placeholder="Credits"
            value={subject.credits || ''}
            onChange={(event) =>
              setSubject({ ...subject, credits: Number(event.target.value) })
            }
            required
          />
          <button type="submit">Save subject</button>
        </form>
        <form
          onSubmit={(event) =>
            void save(event, () =>
              enrollments.save({ ...enrollment, id: enrollment.id || id() }),
            )
          }
        >
          <select
            aria-label="Enrollment subject"
            value={enrollment.subjectId}
            onChange={(event) =>
              setEnrollment({ ...enrollment, subjectId: event.target.value })
            }
            required
          >
            <option value="">Select subject</option>
            {records.subjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Enrollment semester"
            value={enrollment.semesterId}
            onChange={(event) =>
              setEnrollment({ ...enrollment, semesterId: event.target.value })
            }
            required
          >
            <option value="">Select semester</option>
            {records.semesters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Enrollment status"
            value={enrollment.status}
            onChange={(event) =>
              setEnrollment({
                ...enrollment,
                status: event.target.value as Enrollment['status'],
              })
            }
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <option value="deferred">Deferred</option>
          </select>
          <button type="submit">Save enrollment</button>
        </form>
      </section>

      <section>
        <h2>Course grade</h2>
        <form
          onSubmit={(event) =>
            void save(event, async () => {
              if (grade.originalScore === undefined || !conversion)
                throw new Error('Enter a course score')
              await grades.save({
                ...grade,
                id: grade.id || id(),
                value: String(grade.originalScore),
                letterGrade: conversion.letterGrade,
                fourPointValue: conversion.fourPointValue,
              })
            })
          }
        >
          <select
            aria-label="Grade enrollment"
            value={grade.enrollmentId}
            onChange={(event) =>
              setGrade({ ...grade, enrollmentId: event.target.value })
            }
            required
          >
            <option value="">Select enrollment</option>
            {records.enrollments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
          <input
            aria-label="Course score"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="Score / 10"
            value={grade.originalScore ?? ''}
            onChange={(event) =>
              setGrade({
                ...grade,
                originalScore: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            required
          />
          <button type="submit">Save grade</button>
          {conversion && (
            <output>
              {' '}
              {conversion.letterGrade} / {conversion.fourPointValue.toFixed(1)}
            </output>
          )}
        </form>
      </section>

      <section>
        <h2>Saved records</h2>
        <p>
          {records.programs.length} programs, {records.years.length} years,{' '}
          {records.semesters.length} semesters, {records.subjects.length}{' '}
          subjects, {records.enrollments.length} enrollments,{' '}
          {records.grades.length} grades.
        </p>
        <p>
          Historical records are retained; destructive deletion is intentionally
          unavailable.
        </p>
      </section>
    </main>
  )
}

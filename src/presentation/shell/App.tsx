import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { convertCourseScore } from '../../domain'
import type { GradeConversion } from '../../domain'
import type {
  AnalyticsRepositories,
  DashboardSummary,
  PlannerRepositories,
} from '../../application'
import type { GoalRepositories } from '../../application/ports/goalRepositories'
import { getDashboardSummary } from '../../application'
import type { PersistenceDatabase } from '../../application/ports/persistence'
import { BackupRestore } from '../backup/BackupRestore'
import { GoalsDashboard } from '../goals/GoalsDashboard'
import type {
  AcademicProgram,
  AcademicYear,
  Enrollment,
  Grade,
  Semester,
  StudentProfile,
  Subject,
} from '../../domain'
const id = () => crypto.randomUUID()

function describeAnalyticsStatus(status: string): string {
  if (status === 'Incomplete')
    return 'Required academic information is missing or unresolved.'
  if (status === 'Unavailable')
    return 'This metric cannot be calculated from the available information.'
  if (status === 'Data integrity issue')
    return 'Academic data needs review because source records conflict or are invalid.'
  return 'This calculation uses sufficient valid academic data.'
}

export interface AppProps {
  repositories: AnalyticsRepositories
  plannerRepositories: PlannerRepositories
  goalRepositories: GoalRepositories
  database: PersistenceDatabase
  planner?: ReactNode
}

export function App({
  repositories,
  plannerRepositories,
  goalRepositories,
  database,
  planner,
}: AppProps) {
  const {
    profiles,
    programs,
    years,
    semesters,
    subjects,
    enrollments,
    grades,
  } = repositories
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
  const [dashboard, setDashboard] = useState<DashboardSummary>()

  const reload = useCallback(async () => {
    const nextDashboard = await getDashboardSummary(repositories)
    setRecords(nextDashboard.sourceRecords)
    setDashboard(nextDashboard)
  }, [repositories])

  useEffect(() => {
    void reload()
  }, [reload])

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
  let conversion: GradeConversion | undefined
  let conversionError = ''
  if (score !== undefined) {
    try {
      conversion = convertCourseScore(score)
    } catch (error) {
      conversionError = error instanceof Error ? error.message : 'Invalid score'
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <header>
        <p>ACADEMIC OS</p>
        <h1>Academic OS</h1>
        <h2>Academic record workspace</h2>
        <p>
          Persist your academic history locally, with official course conversion
          and user-provided GPA.
        </p>
        <strong role="status">{message}</strong>
      </header>

      <section aria-labelledby="dashboard-heading">
        <h2 id="dashboard-heading">Academic dashboard</h2>
        <p>Official GPA: {dashboard?.profile?.overallGpa ?? 'Not provided'}</p>
        <p>
          Calculated GPA:{' '}
          {dashboard?.calculatedGpa.status === 'Available'
            ? dashboard.calculatedGpa.value?.toFixed(2)
            : (dashboard?.calculatedGpa.status ?? 'Unavailable')}
        </p>
        <p>
          Credit progress: {dashboard?.creditProgress.completedCredits ?? 0}{' '}
          completed / {dashboard?.creditProgress.attemptedCredits ?? 0}{' '}
          attempted
          {dashboard?.creditProgress.remainingCredits !== undefined &&
            ` / ${dashboard.creditProgress.remainingCredits} remaining`}
        </p>
        <p>
          Remaining credits:{' '}
          {dashboard?.creditProgress.remainingCredits ?? 'Unavailable'}
        </p>
        <p>
          Completion percentage:{' '}
          {dashboard?.creditProgress.completionPercentage !== undefined
            ? `${dashboard.creditProgress.completionPercentage.toFixed(2)}%`
            : 'Unavailable'}
        </p>
        <p>
          GPA status: {dashboard?.calculatedGpa.status ?? 'Unavailable'}.{' '}
          {describeAnalyticsStatus(
            dashboard?.calculatedGpa.status ?? 'Unavailable',
          )}
        </p>
        <p>
          Current semester: {dashboard?.currentSemester?.name ?? 'Not selected'}
        </p>
        {dashboard?.integrityIssueRecordIds.length ? (
          <p role="alert">
            Academic data needs review for{' '}
            {dashboard.integrityIssueRecordIds.length} source record(s).
          </p>
        ) : null}
        <table>
          <caption>GPA and credit trends</caption>
          <thead>
            <tr>
              <th>Semester</th>
              <th>GPA</th>
              <th>Completed credits</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.trends.points.map((trend) => (
              <tr key={trend.semesterId}>
                <td>{trend.semesterLabel}</td>
                <td>{trend.gpa.value?.toFixed(2) ?? trend.gpa.status}</td>
                <td>{trend.accumulatedCompletedCredits}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Trend status: {dashboard?.trends.status ?? 'Unavailable'}.{' '}
          {describeAnalyticsStatus(dashboard?.trends.status ?? 'Unavailable')}
        </p>
        <table>
          <caption>Semester performance</caption>
          <thead>
            <tr>
              <th>Semester</th>
              <th>GPA</th>
              <th>Attempted credits</th>
              <th>Completed credits</th>
              <th>Completed subjects</th>
              <th>Failed subjects</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.semesterPerformance.map((performance) => (
              <tr key={performance.semester.id}>
                <td>{performance.semester.name}</td>
                <td>
                  {performance.gpa.value?.toFixed(2) ?? performance.gpa.status}
                </td>
                <td>{performance.attemptedCredits}</td>
                <td>{performance.completedCredits}</td>
                <td>{performance.completedSubjectCount}</td>
                <td>{performance.failedSubjectCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <caption>Subject performance</caption>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.subjectPerformance.map((item) => (
              <tr key={item.enrollment.id}>
                <td>{item.subject.name}</td>
                <td>{item.semester.name}</td>
                <td>{item.status}</td>
                <td>{item.grade?.letterGrade ?? 'Not available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <GoalsDashboard
        analyticsRepositories={repositories}
        goalRepositories={goalRepositories}
      />

      {planner}

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
              setGrade({ ...grade, id: '', enrollmentId: event.target.value })
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
          <select
            aria-label="Existing grade"
            value={grade.id}
            onChange={(event) => {
              const selected = records.grades.find(
                (item) => item.id === event.target.value,
              )
              if (selected) setGrade(selected)
            }}
          >
            <option value="">New grade</option>
            {records.grades.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} ({item.letterGrade ?? 'ungraded'})
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
          <label>
            Finalized
            <input
              aria-label="Grade finalized"
              type="checkbox"
              checked={grade.finalized}
              onChange={(event) =>
                setGrade({ ...grade, finalized: event.target.checked })
              }
            />
          </label>
          <button type="submit">Save grade</button>
          {conversion && (
            <output>
              {' '}
              {conversion.letterGrade} / {conversion.fourPointValue.toFixed(1)}
            </output>
          )}
          {conversionError && <span role="alert">{conversionError}</span>}
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

      <BackupRestore
        repositories={repositories}
        plannerRepositories={plannerRepositories}
        goalRepositories={goalRepositories}
        database={database}
        onRestoreComplete={reload}
      />
    </main>
  )
}

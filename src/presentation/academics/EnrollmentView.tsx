import { useState, type FormEvent } from 'react'
import type { Enrollment, Subject, Semester } from '../../domain'
import type { AcademicService } from '../../application'

export interface EnrollmentViewProps {
  enrollments: Enrollment[]
  subjects: Subject[]
  semesters: Semester[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function EnrollmentView({
  enrollments,
  subjects,
  semesters,
  academicService,
  onReload,
}: EnrollmentViewProps) {
  const [enrollment, setEnrollment] = useState<Enrollment>({
    id: '',
    subjectId: '',
    semesterId: '',
    status: 'planned',
  })
  const [message, setMessage] = useState('')

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveEnrollment({
        ...enrollment,
        id: enrollment.id || id(),
      })
      await onReload()
      setMessage('Enrollment saved successfully')
      setEnrollment({
        id: '',
        subjectId: '',
        semesterId: '',
        status: 'planned',
      })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save enrollment',
      )
    }
  }

  async function handleDelete(enrollmentId: string) {
    try {
      await academicService.deleteEnrollment(enrollmentId)
      await onReload()
      setMessage('Enrollment deleted successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete enrollment',
      )
    }
  }

  return (
    <div>
      <h3>Enrollments</h3>
      <form
        onSubmit={(e) => void handleSave(e)}
        style={{ marginBottom: '24px' }}
      >
        <select
          aria-label="Enrollment subject"
          value={enrollment.subjectId}
          onChange={(e) =>
            setEnrollment({ ...enrollment, subjectId: e.target.value })
          }
          required
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id} disabled={s.archived}>
              {s.name} {s.archived ? '(Archived)' : ''}
            </option>
          ))}
        </select>
        <select
          aria-label="Enrollment semester"
          value={enrollment.semesterId}
          onChange={(e) =>
            setEnrollment({ ...enrollment, semesterId: e.target.value })
          }
          required
          style={{ marginLeft: '8px' }}
        >
          <option value="">Select semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Enrollment status"
          value={enrollment.status}
          onChange={(e) =>
            setEnrollment({
              ...enrollment,
              status: e.target.value as Enrollment['status'],
            })
          }
          style={{ marginLeft: '8px' }}
        >
          <option value="planned">Planned</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
          <option value="deferred">Deferred</option>
        </select>
        <button type="submit" style={{ marginLeft: '8px' }}>
          Save Enrollment
        </button>
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>

      {enrollments.length > 0 && (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => {
              const subject = subjects.find((s) => s.id === e.subjectId)
              const semester = semesters.find((s) => s.id === e.semesterId)
              return (
                <tr key={e.id}>
                  <td>{subject?.name ?? 'Unknown'}</td>
                  <td>{semester?.name ?? 'Unknown'}</td>
                  <td>{e.status}</td>
                  <td>
                    <button onClick={() => setEnrollment(e)}>Edit</button>
                    <button
                      onClick={() => void handleDelete(e.id)}
                      style={{ marginLeft: '8px', color: 'red' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

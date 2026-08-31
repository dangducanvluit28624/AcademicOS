import { useState, type FormEvent } from 'react'
import type { Semester, AcademicYear } from '../../domain'
import type { AcademicService } from '../../application'

export interface SemesterViewProps {
  semesters: Semester[]
  years: AcademicYear[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function SemesterView({
  semesters,
  years,
  academicService,
  onReload,
}: SemesterViewProps) {
  const [semester, setSemester] = useState<Semester>({
    id: '',
    academicYearId: '',
    name: '',
    status: 'planned',
  })
  const [message, setMessage] = useState('')

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveSemester({
        ...semester,
        id: semester.id || id(),
      })
      await onReload()
      setMessage('Semester saved successfully')
      setSemester({ id: '', academicYearId: '', name: '', status: 'planned' })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save semester',
      )
    }
  }

  async function handleDelete(semesterId: string) {
    try {
      await academicService.deleteSemester(semesterId)
      await onReload()
      setMessage('Semester deleted successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete semester',
      )
    }
  }

  return (
    <div>
      <h3>Semesters</h3>
      <form
        onSubmit={(e) => void handleSave(e)}
        style={{ marginBottom: '24px' }}
      >
        <input
          aria-label="Semester name"
          placeholder="Semester Name"
          value={semester.name}
          onChange={(e) => setSemester({ ...semester, name: e.target.value })}
          required
        />
        <select
          aria-label="Semester year"
          value={semester.academicYearId}
          onChange={(e) =>
            setSemester({ ...semester, academicYearId: e.target.value })
          }
          required
          style={{ marginLeft: '8px' }}
        >
          <option value="">Select year</option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Semester status"
          value={semester.status}
          onChange={(e) =>
            setSemester({
              ...semester,
              status: e.target.value as Semester['status'],
            })
          }
          style={{ marginLeft: '8px' }}
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" style={{ marginLeft: '8px' }}>
          Save Semester
        </button>
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>

      {semesters.length > 0 && (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((s) => {
              const year = years.find((y) => y.id === s.academicYearId)
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{year?.label ?? 'Unknown'}</td>
                  <td>{s.status}</td>
                  <td>
                    <button onClick={() => setSemester(s)}>Edit</button>
                    <button
                      onClick={() => void handleDelete(s.id)}
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

import { useState, type FormEvent } from 'react'
import type { Subject } from '../../domain'
import type { AcademicService } from '../../application'

export interface SubjectViewProps {
  subjects: Subject[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function SubjectView({
  subjects,
  academicService,
  onReload,
}: SubjectViewProps) {
  const [subject, setSubject] = useState<Subject>({
    id: '',
    name: '',
    credits: 0,
  })
  const [message, setMessage] = useState('')

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveSubject({ ...subject, id: subject.id || id() })
      await onReload()
      setMessage('Subject saved successfully')
      setSubject({ id: '', name: '', credits: 0 })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save subject',
      )
    }
  }

  async function handleArchive(subjectId: string) {
    try {
      await academicService.archiveSubject(subjectId)
      await onReload()
      setMessage('Subject archived successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to archive subject',
      )
    }
  }

  async function handleDelete(subjectId: string) {
    try {
      await academicService.deleteSubject(subjectId)
      await onReload()
      setMessage('Subject deleted successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete subject',
      )
    }
  }

  return (
    <div>
      <h3>Subjects</h3>
      <form
        onSubmit={(e) => void handleSave(e)}
        style={{ marginBottom: '24px' }}
      >
        <input
          aria-label="Subject name"
          placeholder="Subject Name"
          value={subject.name}
          onChange={(e) => setSubject({ ...subject, name: e.target.value })}
          required
        />
        <input
          aria-label="Subject credits"
          type="number"
          min="0"
          step="0.5"
          placeholder="Credits"
          value={subject.credits || ''}
          onChange={(e) =>
            setSubject({ ...subject, credits: Number(e.target.value) })
          }
          required
          style={{ marginLeft: '8px' }}
        />
        <button type="submit" style={{ marginLeft: '8px' }}>
          Save Subject
        </button>
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>

      {subjects.length > 0 && (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Credits</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.credits}</td>
                <td>{s.archived ? 'Archived' : 'Active'}</td>
                <td>
                  <button onClick={() => setSubject(s)}>Edit</button>
                  {!s.archived && (
                    <button
                      onClick={() => void handleArchive(s.id)}
                      style={{ marginLeft: '8px' }}
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => void handleDelete(s.id)}
                    style={{ marginLeft: '8px', color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

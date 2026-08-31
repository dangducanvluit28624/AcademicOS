import { useState, type FormEvent } from 'react'
import type { AcademicProgram } from '../../domain'
import type { AcademicService } from '../../application'

export interface ProgramViewProps {
  programs: AcademicProgram[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function ProgramView({
  programs,
  academicService,
  onReload,
}: ProgramViewProps) {
  const [program, setProgram] = useState<AcademicProgram>({ id: '', name: '' })
  const [message, setMessage] = useState('')

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveProgram({ ...program, id: program.id || id() })
      await onReload()
      setMessage('Program saved successfully')
      setProgram({ id: '', name: '' })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save program',
      )
    }
  }

  async function handleDelete(programId: string) {
    try {
      await academicService.deleteProgram(programId)
      await onReload()
      setMessage('Program deleted successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete program',
      )
    }
  }

  return (
    <div>
      <h3>Programs</h3>
      <form
        onSubmit={(e) => void handleSave(e)}
        style={{ marginBottom: '24px' }}
      >
        <input
          aria-label="Program name"
          placeholder="Program Name"
          value={program.name}
          onChange={(e) => setProgram({ ...program, name: e.target.value })}
          required
        />
        <button type="submit" style={{ marginLeft: '8px' }}>
          Save Program
        </button>
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>

      {programs.length > 0 && (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>
                  <button onClick={() => setProgram(p)}>Edit</button>
                  <button
                    onClick={() => void handleDelete(p.id)}
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

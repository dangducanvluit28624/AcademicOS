import { useState, type FormEvent } from 'react'
import type { AcademicYear } from '../../domain'
import type { AcademicService } from '../../application'

export interface AcademicYearViewProps {
  years: AcademicYear[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function AcademicYearView({
  years,
  academicService,
  onReload,
}: AcademicYearViewProps) {
  const [year, setYear] = useState<AcademicYear>({ id: '', label: '' })
  const [message, setMessage] = useState('')

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveYear({ ...year, id: year.id || id() })
      await onReload()
      setMessage('Year saved successfully')
      setYear({ id: '', label: '' })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save year')
    }
  }

  async function handleDelete(yearId: string) {
    try {
      await academicService.deleteYear(yearId)
      await onReload()
      setMessage('Year deleted successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete year',
      )
    }
  }

  return (
    <div>
      <h3>Academic Years</h3>
      <form
        onSubmit={(e) => void handleSave(e)}
        style={{ marginBottom: '24px' }}
      >
        <input
          aria-label="Academic year label"
          placeholder="e.g. 2023-2024"
          value={year.label}
          onChange={(e) => setYear({ ...year, label: e.target.value })}
          required
        />
        <button type="submit" style={{ marginLeft: '8px' }}>
          Save Year
        </button>
        {message && (
          <span style={{ marginLeft: '16px' }} role="status">
            {message}
          </span>
        )}
      </form>

      {years.length > 0 && (
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Label</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y.id}>
                <td>{y.label}</td>
                <td>
                  <button onClick={() => setYear(y)}>Edit</button>
                  <button
                    onClick={() => void handleDelete(y.id)}
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

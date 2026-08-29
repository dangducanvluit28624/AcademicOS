import { useState, type FormEvent } from 'react'
import type {
  AnalyticsRepositories,
  PlannerRepositories,
} from '../../application'
import {
  createBackup,
  validateBackup,
  inspectBackup,
  restoreBackup,
} from '../../application'
import type { BackupPreview } from '../../application'
import type { BackupEnvelope } from '../../domain'
import type { PersistenceDatabase } from '../../application/ports/persistence'

export interface BackupRestoreProps {
  repositories: AnalyticsRepositories
  plannerRepositories: PlannerRepositories
  database: PersistenceDatabase
  onRestoreComplete: () => Promise<void>
}

export function BackupRestore({
  repositories,
  plannerRepositories,
  database,
  onRestoreComplete,
}: BackupRestoreProps) {
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<BackupPreview | null>(null)
  const [envelope, setEnvelope] = useState<BackupEnvelope | null>(null)

  async function handleExport() {
    try {
      const backup = await createBackup(repositories, plannerRepositories)
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `academic-os-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setMessage('Backup exported successfully')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Failed to export backup',
      )
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsedEnvelope = validateBackup(content)
        const parsedPreview = inspectBackup(parsedEnvelope)
        setEnvelope(parsedEnvelope)
        setPreview(parsedPreview)
        setMessage('Backup file validated')
      } catch (error) {
        setEnvelope(null)
        setPreview(null)
        setMessage(
          error instanceof Error ? error.message : 'Invalid backup file',
        )
      }
    }
    reader.onerror = () => {
      setMessage('Failed to read file')
    }
    reader.readAsText(file)
  }

  async function handleRestore(event: FormEvent) {
    event.preventDefault()
    if (!envelope) return

    try {
      await restoreBackup(envelope, database)
      setEnvelope(null)
      setPreview(null)
      setMessage('Backup restored successfully')
      await onRestoreComplete()
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Failed to restore backup',
      )
    }
  }

  return (
    <section aria-labelledby="backup-heading">
      <h2 id="backup-heading">Backup & Restore</h2>
      <p role="status">{message}</p>

      <div>
        <h3>Backup</h3>
        <button onClick={() => void handleExport()}>Create Backup</button>
      </div>

      <div>
        <h3>Restore</h3>
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          aria-label="Choose Backup File"
        />

        {preview && (
          <form onSubmit={(e) => void handleRestore(e)}>
            <h4>Restore Preview</h4>
            <p>Backup format: v{preview.formatVersion}</p>
            <p>Database schema: v{preview.schemaVersion}</p>
            <p>Created: {new Date(preview.createdAt).toLocaleString()}</p>

            <h5>Records:</h5>
            <ul>
              <li>Student profiles: {preview.counts.studentProfiles}</li>
              <li>Programs: {preview.counts.academicPrograms}</li>
              <li>Academic years: {preview.counts.academicYears}</li>
              <li>Semesters: {preview.counts.semesters}</li>
              <li>Subjects: {preview.counts.subjects}</li>
              <li>Enrollments: {preview.counts.enrollments}</li>
              <li>Grades: {preview.counts.grades}</li>
              <li>Tasks: {preview.counts.tasks}</li>
              <li>Academic events: {preview.counts.academicEvents}</li>
            </ul>

            <div role="alert" style={{ color: 'red', fontWeight: 'bold' }}>
              WARNING: Restoring this backup will replace your current Academic
              OS data.
            </div>

            <button
              type="button"
              onClick={() => {
                setPreview(null)
                setEnvelope(null)
              }}
            >
              Cancel
            </button>
            <button type="submit">Restore</button>
          </form>
        )}
      </div>
    </section>
  )
}

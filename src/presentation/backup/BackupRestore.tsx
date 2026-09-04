import { useState, type FormEvent } from 'react'
import type {
  AnalyticsRepositories,
  PlannerRepositories,
} from '../../application'
import type { GoalRepositories } from '../../application/ports/goalRepositories'
import {
  createBackup,
  validateBackup,
  inspectBackup,
  restoreBackup,
} from '../../application'
import type { BackupPreview } from '../../application'
import type { BackupEnvelope } from '../../domain'
import type { PersistenceDatabase } from '../../application/ports/persistence'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import {
  Download,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  Database,
  CheckCircle2,
  X,
  HardDrive,
  FileJson,
} from 'lucide-react'

export interface BackupRestoreProps {
  repositories: AnalyticsRepositories
  plannerRepositories: PlannerRepositories
  goalRepositories: GoalRepositories
  database: PersistenceDatabase
  onRestoreComplete: () => Promise<void>
}

export function BackupRestore({
  repositories,
  plannerRepositories,
  goalRepositories,
  database,
  onRestoreComplete,
}: BackupRestoreProps) {
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<BackupPreview | null>(null)
  const [envelope, setEnvelope] = useState<BackupEnvelope | null>(null)

  async function handleExport() {
    try {
      const backup = await createBackup(
        repositories,
        plannerRepositories,
        goalRepositories,
      )
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
    <section aria-labelledby="backup-heading" className="space-y-6">
      <PageHeader
        id="backup-heading"
        title="Backup & Restore"
        subtitle="Full snapshot export and import utility for offline data persistence and portability."
      />

      {message && (
        <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs font-semibold text-indigo-900 flex items-center justify-between">
          <p role="status" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            {message}
          </p>
          <button
            onClick={() => setMessage('')}
            className="text-indigo-400 hover:text-indigo-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export / Create Backup */}
        <Card
          title="Backup"
          subtitle="Export complete offline database snapshot to a portable JSON file"
          icon={<Download className="w-4 h-4 text-indigo-600" />}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Export an encrypted, schema-versioned snapshot containing your
              student profile, curriculum catalog, semester records, course
              grades, planner tasks, academic events, and goal progress.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800">
                  Offline-First Architecture
                </p>
                <p className="text-slate-500">
                  Data resides locally on your device. Export backups regularly
                  for disaster recovery.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => void handleExport()}
              icon={<Download className="w-4 h-4" />}
            >
              Create Backup
            </Button>
          </div>
        </Card>

        {/* Restore Section */}
        <Card
          title="Restore"
          subtitle="Load and inspect an existing backup file before applying changes"
          icon={<UploadCloud className="w-4 h-4 text-indigo-600" />}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Select a valid Academic OS JSON backup. The system validates
              schema integrity and presents a record breakdown before restoring.
            </p>

            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl p-5 text-center transition-colors bg-slate-50/50">
              <FileJson className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <label
                htmlFor="backup-file-input"
                className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Choose a JSON file or drag and drop
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                Accepts .json backup files generated by Academic OS
              </p>
              <input
                id="backup-file-input"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                aria-label="Choose Backup File"
                className="mt-3 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            {/* Restore Preview Panel */}
            {preview && (
              <form
                onSubmit={(e) => void handleRestore(e)}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-800">
                    Restore Preview
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Format
                    </span>
                    <p className="font-mono font-semibold text-slate-800">
                      Backup format: v{preview.formatVersion}
                    </p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Schema
                    </span>
                    <p className="font-mono font-semibold text-slate-800">
                      Database schema: v{preview.schemaVersion}
                    </p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Timestamp
                    </span>
                    <p className="text-slate-800 truncate">
                      Created: {new Date(preview.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Records:
                  </h5>
                  <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 list-none p-0">
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Student profiles: {preview.counts.studentProfiles}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Programs: {preview.counts.academicPrograms}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Academic years: {preview.counts.academicYears}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Semesters: {preview.counts.semesters}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Subjects: {preview.counts.subjects}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Enrollments: {preview.counts.enrollments}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Grades: {preview.counts.grades}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Tasks: {preview.counts.tasks}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Academic events: {preview.counts.academicEvents}
                    </li>
                    <li className="bg-white p-2 rounded border border-slate-100">
                      Goals: {preview.counts.goals}
                    </li>
                  </ul>
                </div>

                <div
                  role="alert"
                  className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    WARNING: Restoring this backup will replace your current
                    Academic OS data.
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setPreview(null)
                      setEnvelope(null)
                    }}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    icon={<Database className="w-4 h-4" />}
                  >
                    Restore
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}

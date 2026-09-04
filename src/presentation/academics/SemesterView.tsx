import { useState, type FormEvent } from 'react'
import type { Semester, AcademicYear } from '../../domain'
import type { AcademicService } from '../../application'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { StatusBadge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { Clock, Plus, Edit2, Trash2, X } from 'lucide-react'

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
  const [isSuccess, setIsSuccess] = useState(true)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveSemester({
        ...semester,
        id: semester.id || id(),
      })
      await onReload()
      setMessage('Semester saved successfully')
      setIsSuccess(true)
      setSemester({ id: '', academicYearId: '', name: '', status: 'planned' })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save semester',
      )
      setIsSuccess(false)
    }
  }

  async function handleDelete(semesterId: string) {
    try {
      await academicService.deleteSemester(semesterId)
      await onReload()
      setMessage('Semester deleted successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete semester',
      )
      setIsSuccess(false)
    }
  }

  const isEditing = Boolean(semester.id)

  return (
    <div className="space-y-6">
      <Card
        title={isEditing ? 'Edit Semester' : 'Create Semester'}
        subtitle="Manage academic terms, seasonal sessions, and active study periods"
        icon={<Clock className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Semester Name"
              aria-label="Semester name"
              placeholder="e.g. Fall 2024"
              value={semester.name}
              onChange={(e) =>
                setSemester({ ...semester, name: e.target.value })
              }
              required
            />
            <Select
              label="Academic Year"
              aria-label="Semester year"
              value={semester.academicYearId}
              onChange={(e) =>
                setSemester({ ...semester, academicYearId: e.target.value })
              }
              required
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.label}
                </option>
              ))}
            </Select>
            <Select
              label="Status"
              aria-label="Semester status"
              value={semester.status}
              onChange={(e) =>
                setSemester({
                  ...semester,
                  status: e.target.value as Semester['status'],
                })
              }
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              icon={
                isEditing ? (
                  <Edit2 className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )
              }
            >
              Save Semester
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setSemester({
                    id: '',
                    academicYearId: '',
                    name: '',
                    status: 'planned',
                  })
                }
                icon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
            )}
            {message && (
              <span
                role="status"
                className={`ml-2 text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {message}
              </span>
            )}
          </div>
        </form>
      </Card>

      <Card
        title="Configured Semesters"
        subtitle={`${semesters.length} academic semester(s) found`}
      >
        {semesters.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {semesters.map((s) => {
                  const year = years.find((y) => y.id === s.academicYearId)
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600">
                        {year?.label ?? 'Unknown'}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSemester(s)}
                            icon={<Edit2 className="w-3 h-3" />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => void handleDelete(s.id)}
                            icon={<Trash2 className="w-3 h-3" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No semesters found"
            description="Create your first semester above to begin enrolling courses."
            icon={<Clock className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>
    </div>
  )
}

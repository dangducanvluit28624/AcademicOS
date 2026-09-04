import { useState, type FormEvent } from 'react'
import type { AcademicYear } from '../../domain'
import type { AcademicService } from '../../application'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { EmptyState } from '../components/EmptyState'
import { CalendarDays, Plus, Edit2, Trash2, X } from 'lucide-react'

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
  const [isSuccess, setIsSuccess] = useState(true)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveYear({ ...year, id: year.id || id() })
      await onReload()
      setMessage('Year saved successfully')
      setIsSuccess(true)
      setYear({ id: '', label: '' })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save year')
      setIsSuccess(false)
    }
  }

  async function handleDelete(yearId: string) {
    try {
      await academicService.deleteYear(yearId)
      await onReload()
      setMessage('Year deleted successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete year',
      )
      setIsSuccess(false)
    }
  }

  const isEditing = Boolean(year.id)

  return (
    <div className="space-y-6">
      <Card
        title={isEditing ? 'Edit Academic Year' : 'Create Academic Year'}
        subtitle="Establish academic cycles for semester grouping and progress tracking"
        icon={<CalendarDays className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Input
                label="Academic Year Label"
                aria-label="Academic year label"
                placeholder="e.g. 2023-2024"
                value={year.label}
                onChange={(e) => setYear({ ...year, label: e.target.value })}
                required
                helperText="Format: YYYY-YYYY (e.g., 2024-2025)"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
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
                Save Year
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setYear({ id: '', label: '' })}
                  icon={<X className="w-4 h-4" />}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {message && (
            <div className="pt-1">
              <span
                role="status"
                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isSuccess
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {message}
              </span>
            </div>
          )}
        </form>
      </Card>

      <Card
        title="Configured Academic Years"
        subtitle={`${years.length} academic year(s) active`}
      >
        {years.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Academic Year
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {years.map((y) => (
                  <tr
                    key={y.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-800 font-mono">
                      {y.label}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setYear(y)}
                          icon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => void handleDelete(y.id)}
                          icon={<Trash2 className="w-3 h-3" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No academic years found"
            description="Add an academic year above to organize your semesters."
            icon={<CalendarDays className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>
    </div>
  )
}

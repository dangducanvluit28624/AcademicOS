import { useState, type FormEvent } from 'react'
import type { Subject } from '../../domain'
import type { AcademicService } from '../../application'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { StatusBadge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { BookMarked, Plus, Edit2, Archive, Trash2, X } from 'lucide-react'

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
  const [isSuccess, setIsSuccess] = useState(true)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveSubject({ ...subject, id: subject.id || id() })
      await onReload()
      setMessage('Subject saved successfully')
      setIsSuccess(true)
      setSubject({ id: '', name: '', credits: 0 })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save subject',
      )
      setIsSuccess(false)
    }
  }

  async function handleArchive(subjectId: string) {
    try {
      await academicService.archiveSubject(subjectId)
      await onReload()
      setMessage('Subject archived successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to archive subject',
      )
      setIsSuccess(false)
    }
  }

  async function handleDelete(subjectId: string) {
    try {
      await academicService.deleteSubject(subjectId)
      await onReload()
      setMessage('Subject deleted successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete subject',
      )
      setIsSuccess(false)
    }
  }

  const isEditing = Boolean(subject.id)

  return (
    <div className="space-y-6">
      <Card
        title={isEditing ? 'Edit Subject / Course' : 'Add Subject / Course'}
        subtitle="Maintain your official curriculum course catalog and credit weights"
        icon={<BookMarked className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subject Name"
              aria-label="Subject name"
              placeholder="e.g. Data Structures & Algorithms"
              value={subject.name}
              onChange={(e) => setSubject({ ...subject, name: e.target.value })}
              required
            />
            <Input
              label="Credits"
              aria-label="Subject credits"
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 3 or 4"
              value={subject.credits || ''}
              onChange={(e) =>
                setSubject({ ...subject, credits: Number(e.target.value) })
              }
              required
              helperText="Academic credit units (e.g., 3.0 or 4.0)"
            />
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
              Save Subject
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSubject({ id: '', name: '', credits: 0 })}
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
        title="Course Catalog"
        subtitle={`${subjects.length} course(s) registered in your curriculum`}
      >
        {subjects.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Credits
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
                {subjects.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-800">
                      {s.name}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">
                      {s.credits}
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge
                        status={s.archived ? 'Archived' : 'Active'}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSubject(s)}
                          icon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        {!s.archived && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => void handleArchive(s.id)}
                            icon={<Archive className="w-3 h-3" />}
                          >
                            Archive
                          </Button>
                        )}
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No courses registered"
            description="Add your curriculum courses above with credit values."
            icon={<BookMarked className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>
    </div>
  )
}

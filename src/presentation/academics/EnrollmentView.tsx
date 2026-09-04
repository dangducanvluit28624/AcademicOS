import { useState, type FormEvent } from 'react'
import type { Enrollment, Subject, Semester } from '../../domain'
import type { AcademicService } from '../../application'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Select } from '../components/Select'
import { StatusBadge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { ClipboardList, Plus, Edit2, Trash2, X } from 'lucide-react'

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
  const [isSuccess, setIsSuccess] = useState(true)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveEnrollment({
        ...enrollment,
        id: enrollment.id || id(),
      })
      await onReload()
      setMessage('Enrollment saved successfully')
      setIsSuccess(true)
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
      setIsSuccess(false)
    }
  }

  async function handleDelete(enrollmentId: string) {
    try {
      await academicService.deleteEnrollment(enrollmentId)
      await onReload()
      setMessage('Enrollment deleted successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete enrollment',
      )
      setIsSuccess(false)
    }
  }

  const isEditing = Boolean(enrollment.id)

  return (
    <div className="space-y-6">
      <Card
        title={
          isEditing ? 'Edit Course Enrollment' : 'Register Course Enrollment'
        }
        subtitle="Associate catalog courses with academic semesters and set status"
        icon={<ClipboardList className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Subject / Course"
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
            </Select>

            <Select
              label="Semester"
              aria-label="Enrollment semester"
              value={enrollment.semesterId}
              onChange={(e) =>
                setEnrollment({ ...enrollment, semesterId: e.target.value })
              }
              required
            >
              <option value="">Select semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>

            <Select
              label="Enrollment Status"
              aria-label="Enrollment status"
              value={enrollment.status}
              onChange={(e) =>
                setEnrollment({
                  ...enrollment,
                  status: e.target.value as Enrollment['status'],
                })
              }
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
              <option value="deferred">Deferred</option>
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
              Save Enrollment
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setEnrollment({
                    id: '',
                    subjectId: '',
                    semesterId: '',
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
        title="Semester Enrollments"
        subtitle={`${enrollments.length} active course enrollment(s)`}
      >
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Semester
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
                {enrollments.map((e) => {
                  const subject = subjects.find((s) => s.id === e.subjectId)
                  const semester = semesters.find((s) => s.id === e.semesterId)
                  return (
                    <tr
                      key={e.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {subject?.name ?? 'Unknown'}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {semester?.name ?? 'Unknown'}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEnrollment(e)}
                            icon={<Edit2 className="w-3 h-3" />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => void handleDelete(e.id)}
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
            title="No enrollments recorded"
            description="Enroll in a course for a semester using the form above."
            icon={<ClipboardList className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>
    </div>
  )
}

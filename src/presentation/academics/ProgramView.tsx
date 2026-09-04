import { useState, type FormEvent } from 'react'
import type { AcademicProgram } from '../../domain'
import type { AcademicService } from '../../application'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { EmptyState } from '../components/EmptyState'
import { BookOpen, Plus, Edit2, Trash2, X } from 'lucide-react'

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
  const [isSuccess, setIsSuccess] = useState(true)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      await academicService.saveProgram({ ...program, id: program.id || id() })
      await onReload()
      setMessage('Program saved successfully')
      setIsSuccess(true)
      setProgram({ id: '', name: '' })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save program',
      )
      setIsSuccess(false)
    }
  }

  async function handleDelete(programId: string) {
    try {
      await academicService.deleteProgram(programId)
      await onReload()
      setMessage('Program deleted successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete program',
      )
      setIsSuccess(false)
    }
  }

  const isEditing = Boolean(program.id)

  return (
    <div className="space-y-6">
      <Card
        title={isEditing ? 'Edit Academic Program' : 'Create Academic Program'}
        subtitle="Define degree majors, tracks, or academic curriculums"
        icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Input
                label="Program Name"
                aria-label="Program name"
                placeholder="e.g. B.S. Computer Science"
                value={program.name}
                onChange={(e) =>
                  setProgram({ ...program, name: e.target.value })
                }
                required
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
                Save Program
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setProgram({ id: '', name: '' })}
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
        title="Registered Programs"
        subtitle={`${programs.length} degree program(s) configured`}
      >
        {programs.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Program Name
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-800">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setProgram(p)}
                          icon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => void handleDelete(p.id)}
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
            title="No degree programs found"
            description="Add your primary major or degree track above to get started."
            icon={<BookOpen className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>
    </div>
  )
}

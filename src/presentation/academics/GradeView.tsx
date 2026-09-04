import { useState, type FormEvent } from 'react'
import type { Grade, Enrollment } from '../../domain'
import { convertCourseScore } from '../../domain'
import type { AcademicService } from '../../application'
import type { GradeConversion } from '../../domain'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Badge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { Award, Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react'

export interface GradeViewProps {
  grades: Grade[]
  enrollments: Enrollment[]
  academicService: AcademicService
  onReload: () => Promise<void>
}

const id = () => crypto.randomUUID()

export function GradeView({
  grades,
  enrollments,
  academicService,
  onReload,
}: GradeViewProps) {
  const [grade, setGrade] = useState<Grade>({
    id: '',
    enrollmentId: '',
    value: '',
    finalized: false,
  })
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)

  const score = grade.originalScore
  let conversion: GradeConversion | undefined
  let conversionError = ''
  if (score !== undefined) {
    try {
      conversion = convertCourseScore(score)
    } catch (error) {
      conversionError = error instanceof Error ? error.message : 'Invalid score'
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    try {
      if (grade.originalScore === undefined || !conversion)
        throw new Error('Enter a course score')
      await academicService.saveGrade({
        ...grade,
        id: grade.id || id(),
        value: String(grade.originalScore),
        letterGrade: conversion.letterGrade,
        fourPointValue: conversion.fourPointValue,
      })
      await onReload()
      setMessage('Grade saved successfully')
      setIsSuccess(true)
      setGrade({ id: '', enrollmentId: '', value: '', finalized: false })
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to save grade',
      )
      setIsSuccess(false)
    }
  }

  async function handleDelete(gradeId: string) {
    try {
      await academicService.deleteGrade(gradeId)
      await onReload()
      setMessage('Grade deleted successfully')
      setIsSuccess(true)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete grade',
      )
      setIsSuccess(false)
    }
  }

  const isEditing = Boolean(grade.id)

  return (
    <div className="space-y-6">
      <Card
        title={isEditing ? 'Edit Grade Record' : 'Record Course Grade'}
        subtitle="10-point score converted directly to standard letter grades and 4.0 scale GPA"
        icon={<Award className="w-4 h-4 text-indigo-600" />}
      >
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Target Enrollment"
              aria-label="Grade enrollment"
              value={grade.enrollmentId}
              onChange={(e) =>
                setGrade({ ...grade, id: '', enrollmentId: e.target.value })
              }
              required
            >
              <option value="">Select enrollment</option>
              {enrollments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}
                </option>
              ))}
            </Select>

            <Select
              label="Load Existing Grade"
              aria-label="Existing grade"
              value={grade.id}
              onChange={(e) => {
                const selected = grades.find(
                  (item) => item.id === e.target.value,
                )
                if (selected) setGrade(selected)
                else
                  setGrade({
                    id: '',
                    enrollmentId: grade.enrollmentId,
                    value: '',
                    finalized: false,
                  })
              }}
            >
              <option value="">New grade</option>
              {grades.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} ({item.letterGrade ?? 'ungraded'})
                </option>
              ))}
            </Select>

            <Input
              label="Course Score (0 - 10)"
              aria-label="Course score"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="e.g. 8.5"
              value={grade.originalScore ?? ''}
              onChange={(e) =>
                setGrade({
                  ...grade,
                  originalScore: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              required
              helperText="10-point numerical score"
            />

            <div className="flex flex-col justify-center pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  aria-label="Grade finalized"
                  type="checkbox"
                  checked={grade.finalized}
                  onChange={(e) =>
                    setGrade({ ...grade, finalized: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Finalized
              </label>
              <span className="text-[11px] text-slate-400 mt-1">
                Include in cumulative GPA calculations
              </span>
            </div>
          </div>

          {/* Live Scale Conversion Callout */}
          {conversion && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Converted scale:</span>
              <output className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700 shadow-2xs">
                {conversion.letterGrade} /{' '}
                {conversion.fourPointValue.toFixed(1)}
              </output>
              <span className="text-indigo-600">
                ({conversion.letterGrade} corresponds to{' '}
                {conversion.fourPointValue.toFixed(1)} on a 4.0 GPA scale)
              </span>
            </div>
          )}

          {conversionError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
              <span role="alert" className="text-xs font-medium text-rose-700">
                {conversionError}
              </span>
            </div>
          )}

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
              Save Grade
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setGrade({
                    id: '',
                    enrollmentId: '',
                    value: '',
                    finalized: false,
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
        title="Recorded Grades"
        subtitle={`${grades.length} recorded course grade(s)`}
      >
        {grades.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Enrollment ID
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Score (10-pt)
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Letter Grade
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Finalized
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((g) => (
                  <tr
                    key={g.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-700">
                      {g.enrollmentId}
                    </td>
                    <td className="py-3.5 px-5 font-mono font-semibold text-slate-800">
                      {g.value}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono">
                        {g.letterGrade ?? 'Ungraded'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge variant={g.finalized ? 'success' : 'neutral'}>
                        {g.finalized ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setGrade(g)}
                          icon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => void handleDelete(g.id)}
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
            title="No grades recorded yet"
            description="Select an enrollment and assign a 10-point course score above."
            icon={<Award className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>
    </div>
  )
}

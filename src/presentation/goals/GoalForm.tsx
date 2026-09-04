import { useState } from 'react'
import type {
  AcademicGoal,
  GoalTargetType,
  AcademicProgram,
} from '../../domain'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Target, Save, X } from 'lucide-react'

export interface GoalFormProps {
  programs: AcademicProgram[]
  initialGoal?: AcademicGoal
  onSave: (goal: AcademicGoal) => Promise<void>
  onCancel: () => void
}

export function GoalForm({
  programs,
  initialGoal,
  onSave,
  onCancel,
}: GoalFormProps) {
  const [title, setTitle] = useState(initialGoal?.title ?? '')
  const [targetType, setTargetType] = useState<GoalTargetType>(
    initialGoal?.targetType ?? 'gpa',
  )
  const [targetValue, setTargetValue] = useState(
    initialGoal?.targetValue?.toString() ?? '',
  )
  const [academicProgramId, setAcademicProgramId] = useState(
    initialGoal?.academicProgramId ?? '',
  )
  const [error, setError] = useState<string>('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const parsedTarget = parseFloat(targetValue)
      const goal: AcademicGoal = {
        id: initialGoal?.id ?? crypto.randomUUID(),
        title: title.trim(),
        targetType,
        targetValue: parsedTarget,
        academicProgramId:
          targetType === 'graduation-credits' && academicProgramId
            ? academicProgramId
            : undefined,
        status: initialGoal?.status ?? 'active',
        createdAt: initialGoal?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await onSave(goal)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid goal data')
    }
  }

  return (
    <Card
      title={initialGoal ? 'Edit Goal' : 'Create Academic Goal'}
      subtitle="Define target thresholds for cumulative GPA, credits, or degree milestones"
      icon={<Target className="w-4 h-4 text-indigo-600" />}
      className="mb-6 border-indigo-200/80 shadow-xs"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <h3 className="sr-only">{initialGoal ? 'Edit Goal' : 'Create Goal'}</h3>
        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="title"
            label="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dean's List GPA Target"
            required
          />

          <Select
            id="targetType"
            label="Goal Type"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as GoalTargetType)}
          >
            <option value="gpa">GPA</option>
            <option value="credits">Credits</option>
            <option value="graduation-credits">
              Graduation (Program Credits)
            </option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="targetValue"
            label="Target Value"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 3.8 or 120"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            required
            helperText={
              targetType === 'gpa'
                ? 'Target GPA on 4.0 scale (e.g. 3.80)'
                : 'Target credit hours'
            }
          />

          {targetType === 'graduation-credits' && (
            <Select
              id="academicProgramId"
              label="Academic Program"
              value={academicProgramId}
              onChange={(e) => setAcademicProgramId(e.target.value)}
              required
            >
              <option value="">Select a program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={<Save className="w-4 h-4" />}
          >
            Save Goal
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

import { useState } from 'react'
import type {
  AcademicGoal,
  GoalTargetType,
  AcademicProgram,
} from '../../domain'

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
    <form onSubmit={(e) => void handleSubmit(e)}>
      <h3>{initialGoal ? 'Edit Goal' : 'Create Goal'}</h3>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title">Goal Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="targetType">Goal Type</label>
        <select
          id="targetType"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as GoalTargetType)}
        >
          <option value="gpa">GPA</option>
          <option value="credits">Credits</option>
          <option value="graduation-credits">
            Graduation (Program Credits)
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="targetValue">Target Value</label>
        <input
          id="targetValue"
          type="number"
          step="0.01"
          min="0"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          required
        />
      </div>

      {targetType === 'graduation-credits' && (
        <div>
          <label htmlFor="academicProgramId">Academic Program</label>
          <select
            id="academicProgramId"
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
          </select>
        </div>
      )}

      <div>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Save Goal</button>
      </div>
    </form>
  )
}

import { useCallback, useEffect, useState } from 'react'
import type { AcademicProgram } from '../../domain/academic'
import type { AcademicGoal } from '../../domain'
import type { GoalRepositories, AnalyticsRepositories } from '../../application'
import {
  listGoals,
  createGoal,
  updateGoal,
  archiveGoal,
  calculateGoalProgress,
  getGraduationProgress,
} from '../../application/goals'
import type { GoalProgress, GraduationProgress } from '../../application/goals'
import { GoalForm } from './GoalForm'

export interface GoalsDashboardProps {
  goalRepositories: GoalRepositories
  analyticsRepositories: AnalyticsRepositories
}

export function GoalsDashboard({
  goalRepositories,
  analyticsRepositories,
}: GoalsDashboardProps) {
  const [goals, setGoals] = useState<GoalProgress[]>([])
  const [gradProgress, setGradProgress] = useState<GraduationProgress | null>(
    null,
  )
  const [programs, setPrograms] = useState<AcademicProgram[]>([])
  const [editingGoal, setEditingGoal] = useState<AcademicGoal | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [rawGoals, allPrograms, enrollments] = await Promise.all([
        listGoals(goalRepositories),
        analyticsRepositories.programs.list(),
        analyticsRepositories.enrollments.list(),
      ])

      const subjects = await analyticsRepositories.subjects.list()
      const semesters = await analyticsRepositories.semesters.list()
      const grades = await analyticsRepositories.grades.list()

      const records = enrollments.map((e) => {
        const subject = subjects.find((s) => s.id === e.subjectId)!
        const semester = semesters.find((s) => s.id === e.semesterId)!
        const recordGrades = grades.filter((g) => g.enrollmentId === e.id)
        return { enrollment: e, subject, semester, grades: recordGrades }
      })

      setPrograms(allPrograms)

      const calculated = rawGoals.map((g) =>
        calculateGoalProgress(
          g,
          records,
          g.academicProgramId
            ? allPrograms.find((p) => p.id === g.academicProgramId)
            : undefined,
        ),
      )
      setGoals(calculated)

      if (allPrograms.length > 0) {
        setGradProgress(getGraduationProgress(records, allPrograms[0]))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load goals')
    }
  }, [goalRepositories, analyticsRepositories])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function handleSaveGoal(goal: AcademicGoal) {
    if (editingGoal) {
      await updateGoal(goalRepositories, goal)
    } else {
      await createGoal(goalRepositories, goal)
    }
    setEditingGoal(null)
    setIsCreating(false)
    await loadData()
  }

  async function handleArchive(id: string) {
    await archiveGoal(goalRepositories, id)
    await loadData()
  }

  function getStatusText(progress: GoalProgress) {
    if (progress.status === 'Unavailable' || progress.status === 'Incomplete')
      return 'Unavailable'
    if (progress.status === 'Data integrity issue')
      return 'Data integrity issue'
    if (progress.achieved) return 'Achieved'
    if (progress.currentValue === 0) return 'Not Started'
    return 'In Progress'
  }

  const visibleGoals = goals.filter((g) =>
    showArchived ? g.goal.status === 'archived' : g.goal.status === 'active',
  )

  return (
    <div aria-labelledby="goals-heading">
      <h2 id="goals-heading">Goals & Graduation Progress</h2>

      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <section>
        <h3>Graduation Progress (Primary Program)</h3>
        {gradProgress ? (
          <div>
            <p>
              Status:{' '}
              <span>
                {gradProgress.status === 'Available'
                  ? 'Available'
                  : gradProgress.status}
              </span>
            </p>
            <p>Completed Credits: {gradProgress.completedCredits}</p>
            {gradProgress.requiredCredits !== undefined && (
              <>
                <p>Required Credits: {gradProgress.requiredCredits}</p>
                <p>Remaining Credits: {gradProgress.remainingCredits}</p>
                <p>
                  Completion: {gradProgress.completionPercentage?.toFixed(1)}%
                </p>
              </>
            )}
          </div>
        ) : (
          <p>No primary program found.</p>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>{showArchived ? 'Archived Goals' : 'Active Goals'}</h3>
          <div>
            <button onClick={() => setShowArchived(!showArchived)}>
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
            <button onClick={() => setIsCreating(true)}>Create Goal</button>
          </div>
        </div>

        {(isCreating || editingGoal) && (
          <GoalForm
            programs={programs}
            initialGoal={editingGoal ?? undefined}
            onSave={handleSaveGoal}
            onCancel={() => {
              setIsCreating(false)
              setEditingGoal(null)
            }}
          />
        )}

        <ul>
          {visibleGoals.map(({ goal, status, currentValue, achieved }) => {
            const derivedStatus = getStatusText({
              goal,
              status,
              currentValue,
              achieved,
            })
            return (
              <li key={goal.id}>
                <h4>{goal.title}</h4>
                <p>Type: {goal.targetType}</p>
                <p>Target: {goal.targetValue}</p>
                <p>
                  Current:{' '}
                  {status === 'Available' ? currentValue.toFixed(2) : 'N/A'}
                </p>
                <p>
                  Data Quality: <span>{status}</span>
                </p>
                <p>
                  Goal Status: <span>{derivedStatus}</span>
                </p>
                {goal.status === 'active' && (
                  <div>
                    <button onClick={() => setEditingGoal(goal)}>Edit</button>
                    <button onClick={() => void handleArchive(goal.id)}>
                      Archive
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

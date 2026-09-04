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
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { StatusBadge } from '../components/Badge'
import { PageHeader } from '../components/PageHeader'
import { ProgressBar } from '../components/ProgressBar'
import { EmptyState } from '../components/EmptyState'
import { Target, GraduationCap, Plus, Archive, Edit2 } from 'lucide-react'

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
    <section aria-labelledby="goals-heading" className="space-y-6">
      <PageHeader
        id="goals-heading"
        title="Goals & Graduation Progress"
        subtitle="Track cumulative milestones, benchmark GPA targets, and monitor degree completion requirements."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowArchived(!showArchived)}
              icon={<Archive className="w-4 h-4" />}
            >
              {showArchived ? 'Show Active' : 'Show Archived'}
            </Button>
            {!showArchived && (
              <Button
                variant="primary"
                onClick={() => setIsCreating(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Goal
              </Button>
            )}
          </div>
        }
      />

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
        >
          {error}
        </div>
      )}

      {/* Graduation Progress Banner Card */}
      <Card
        title="Graduation Progress (Primary Program)"
        subtitle={
          programs[0]
            ? `Degree program: ${programs[0].name}`
            : 'No primary degree program selected'
        }
        icon={<GraduationCap className="w-4 h-4 text-indigo-600" />}
      >
        {gradProgress ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="text-xs text-slate-500 mb-1">
                  Status:{' '}
                  <span className="font-semibold text-slate-800">
                    {gradProgress.status === 'Available'
                      ? 'Available'
                      : gradProgress.status}
                  </span>
                </p>
                <StatusBadge status={gradProgress.status} />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="text-xs text-slate-500 mb-1 font-semibold">
                  Completed Credits: {gradProgress.completedCredits}
                </p>
                <p className="text-xl font-bold text-emerald-700 font-mono">
                  {gradProgress.completedCredits} credits
                </p>
              </div>

              {gradProgress.requiredCredits !== undefined && (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-xs text-slate-500 mb-1 font-semibold">
                      Required Credits: {gradProgress.requiredCredits}
                    </p>
                    <p className="text-xs text-slate-600">
                      Remaining Credits: {gradProgress.remainingCredits}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-xs text-slate-500 mb-1 font-semibold">
                      Completion:{' '}
                      {gradProgress.completionPercentage?.toFixed(1)}%
                    </p>
                    <ProgressBar
                      value={gradProgress.completionPercentage ?? 0}
                      size="sm"
                      variant="success"
                      showPercentage={false}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No primary program found"
            description="Register a degree program in Academics > Programs to unlock degree progression tracking."
            icon={<GraduationCap className="w-8 h-8 text-slate-400" />}
          />
        )}
      </Card>

      {/* Goal Form Modal/Inline */}
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

      {/* Goals List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            {showArchived ? 'Archived Goals' : 'Active Goals'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {visibleGoals.length} goal(s)
          </span>
        </div>

        {visibleGoals.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none m-0 p-0">
            {visibleGoals.map(({ goal, status, currentValue, achieved }) => {
              const derivedStatus = getStatusText({
                goal,
                status,
                currentValue,
                achieved,
              })

              const progressPct =
                goal.targetValue > 0
                  ? Math.min((currentValue / goal.targetValue) * 100, 100)
                  : 0

              return (
                <li
                  key={goal.id}
                  className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                        {goal.title}
                      </h4>
                      <StatusBadge status={derivedStatus} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[11px] text-slate-400 uppercase font-semibold">
                          Type: {goal.targetType}
                        </p>
                        <p className="font-mono font-bold text-slate-800 mt-0.5">
                          Target: {goal.targetValue}
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[11px] text-slate-400 uppercase font-semibold">
                          Data Quality:{' '}
                          <span className="font-bold">{status}</span>
                        </p>
                        <p className="font-mono font-bold text-indigo-700 mt-0.5">
                          Current:{' '}
                          {status === 'Available'
                            ? currentValue.toFixed(2)
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">
                        Goal Status:{' '}
                        <span className="font-semibold">{derivedStatus}</span>
                      </p>
                      {status === 'Available' && (
                        <ProgressBar
                          value={progressPct}
                          size="sm"
                          variant={achieved ? 'success' : 'primary'}
                          showPercentage={false}
                        />
                      )}
                    </div>
                  </div>

                  {goal.status === 'active' && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingGoal(goal)}
                        icon={<Edit2 className="w-3 h-3" />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => void handleArchive(goal.id)}
                        icon={<Archive className="w-3 h-3" />}
                      >
                        Archive
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            title={showArchived ? 'No archived goals' : 'No active goals'}
            description="Establish graduation targets or semester GPA milestones to measure your performance."
            icon={<Target className="w-8 h-8 text-slate-400" />}
          />
        )}
      </div>
    </section>
  )
}

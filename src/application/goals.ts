import type { AcademicGoal } from '../domain/goals'
import type { AcademicProgram } from '../domain/academic'
import type { AcademicRecord, AnalyticsStatus } from '../domain/analytics'
import {
  calculateCumulativeGpa,
  calculateCreditProgress,
} from '../domain/analytics'
import type { GoalRepositories } from './ports/goalRepositories'

export type GoalProgressStatus = AnalyticsStatus
export interface GoalProgress {
  goal: AcademicGoal
  status: GoalProgressStatus
  currentValue: number
  achieved: boolean
}

export function calculateGoalProgress(
  goal: AcademicGoal,
  records: AcademicRecord[],
  program?: AcademicProgram,
): GoalProgress {
  if (goal.targetType === 'gpa') {
    const gpaResult = calculateCumulativeGpa(records)
    const currentValue = gpaResult.value ?? 0
    return {
      goal,
      status: gpaResult.status,
      currentValue,
      achieved:
        gpaResult.status === 'Available' && currentValue >= goal.targetValue,
    }
  }

  if (goal.targetType === 'credits') {
    const creditResult = calculateCreditProgress(records)
    const currentValue = creditResult.completedCredits
    // calculateCreditProgress returns Unavailable if no program is provided,
    // but for a pure credit goal, the target is the goal.targetValue itself.
    const status =
      creditResult.status === 'Data integrity issue'
        ? 'Data integrity issue'
        : 'Available'
    return {
      goal,
      status,
      currentValue,
      achieved: status === 'Available' && currentValue >= goal.targetValue,
    }
  }

  if (goal.targetType === 'graduation-credits') {
    const creditResult = calculateCreditProgress(records, program)
    const currentValue = creditResult.completedCredits

    if (program?.totalRequiredCredits === undefined) {
      return {
        goal,
        status: creditResult.status, // which will be 'Unavailable' or 'Data integrity issue'
        currentValue,
        achieved: false,
      }
    }

    return {
      goal,
      status: creditResult.status,
      currentValue,
      achieved:
        creditResult.status === 'Available' && currentValue >= goal.targetValue, // wait, goal targetValue? For graduation-credits, we use goal.targetValue, which usually matches totalRequiredCredits. Or does it?
    }
  }

  return {
    goal,
    status: 'Unavailable',
    currentValue: 0,
    achieved: false,
  }
}

export interface GraduationProgress {
  status: AnalyticsStatus
  completedCredits: number
  requiredCredits?: number
  remainingCredits?: number
  completionPercentage?: number
}

export function getGraduationProgress(
  records: AcademicRecord[],
  program?: AcademicProgram,
): GraduationProgress {
  const creditProgress = calculateCreditProgress(records, program)

  return {
    status: creditProgress.status,
    completedCredits: creditProgress.completedCredits,
    requiredCredits: program?.totalRequiredCredits,
    remainingCredits: creditProgress.remainingCredits,
    completionPercentage: creditProgress.completionPercentage,
  }
}

export async function createGoal(
  repositories: GoalRepositories,
  goal: AcademicGoal,
): Promise<void> {
  await repositories.goals.save(goal)
}

export async function updateGoal(
  repositories: GoalRepositories,
  goal: AcademicGoal,
): Promise<void> {
  const existing = await repositories.goals.get(goal.id)
  if (!existing) throw new Error('Goal not found')
  await repositories.goals.save(goal)
}

export async function archiveGoal(
  repositories: GoalRepositories,
  id: string,
): Promise<void> {
  const existing = await repositories.goals.get(id)
  if (!existing) throw new Error('Goal not found')
  existing.status = 'archived'
  existing.updatedAt = new Date().toISOString()
  await repositories.goals.save(existing)
}

export async function listGoals(
  repositories: GoalRepositories,
): Promise<AcademicGoal[]> {
  return await repositories.goals.list()
}

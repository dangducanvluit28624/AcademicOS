import type { EntityId, IsoDate } from './academic'

export type GoalTargetType = 'gpa' | 'credits' | 'graduation-credits'
export type GoalStatus = 'active' | 'archived'

export interface AcademicGoal {
  id: EntityId
  title: string
  targetType: GoalTargetType
  targetValue: number
  academicProgramId?: EntityId
  status: GoalStatus
  createdAt: IsoDate
  updatedAt: IsoDate
}

export function validateAcademicGoal(goal: AcademicGoal): void {
  if (!goal.id || typeof goal.id !== 'string') {
    throw new Error('Goal ID must be a non-empty string')
  }
  if (
    !goal.title ||
    typeof goal.title !== 'string' ||
    goal.title.trim() === ''
  ) {
    throw new Error('Goal title must be a non-empty string')
  }
  if (
    goal.targetType !== 'gpa' &&
    goal.targetType !== 'credits' &&
    goal.targetType !== 'graduation-credits'
  ) {
    throw new Error('Invalid target type')
  }
  if (
    typeof goal.targetValue !== 'number' ||
    !Number.isFinite(goal.targetValue) ||
    goal.targetValue < 0
  ) {
    throw new Error('Target value must be a non-negative finite number')
  }
  if (goal.targetType === 'gpa' && goal.targetValue > 4.0) {
    throw new Error('GPA target cannot exceed 4.0')
  }
  if (
    goal.targetType === 'graduation-credits' &&
    (!goal.academicProgramId || typeof goal.academicProgramId !== 'string')
  ) {
    throw new Error(
      'graduation-credits target requires a valid academicProgramId',
    )
  }
  if (goal.status !== 'active' && goal.status !== 'archived') {
    throw new Error('Invalid goal status')
  }
  if (!goal.createdAt || Number.isNaN(Date.parse(goal.createdAt))) {
    throw new Error('Invalid createdAt timestamp')
  }
  if (!goal.updatedAt || Number.isNaN(Date.parse(goal.updatedAt))) {
    throw new Error('Invalid updatedAt timestamp')
  }
}

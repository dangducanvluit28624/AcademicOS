import type { AcademicGoal } from '../../domain'

export interface GoalsRepository {
  list(): Promise<AcademicGoal[]>
  get(id: string): Promise<AcademicGoal | undefined>
  save(goal: AcademicGoal): Promise<void>
}

export interface GoalRepositories {
  goals: GoalsRepository
}

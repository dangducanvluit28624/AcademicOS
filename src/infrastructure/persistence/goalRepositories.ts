import type { GoalsRepository } from '../../application/ports/goalRepositories'
import type { IndexedDbDatabase } from './indexedDbDatabase'
import type { AcademicGoal } from '../../domain'
import { validateAcademicGoal } from '../../domain'

export class IndexedDbGoalsRepository implements GoalsRepository {
  constructor(private readonly database: IndexedDbDatabase) {}

  async list(): Promise<AcademicGoal[]> {
    const records = await this.database.list<AcademicGoal>('goals')
    return records.filter((r) => {
      try {
        validateAcademicGoal(r)
        return true
      } catch {
        return false
      }
    })
  }

  async get(id: string): Promise<AcademicGoal | undefined> {
    const record = await this.database.get<AcademicGoal>('goals', id)
    if (record) {
      validateAcademicGoal(record)
    }
    return record
  }

  async save(goal: AcademicGoal): Promise<void> {
    validateAcademicGoal(goal)
    await this.database.save('goals', goal)
  }
}

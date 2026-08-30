import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { IndexedDbDatabase } from '../../src/infrastructure/persistence/indexedDbDatabase'
import { IndexedDbGoalsRepository } from '../../src/infrastructure/persistence/goalRepositories'
import type { AcademicGoal } from '../../src/domain'

describe('Goals Persistence', () => {
  let database: IndexedDbDatabase
  let repository: IndexedDbGoalsRepository

  beforeEach(() => {
    database = new IndexedDbDatabase()
    repository = new IndexedDbGoalsRepository(database)
  })

  it('can save and retrieve a goal', async () => {
    const goal: AcademicGoal = {
      id: 'g1',
      title: 'Target GPA',
      targetType: 'gpa',
      targetValue: 3.5,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await repository.save(goal)
    const retrieved = await repository.get('g1')
    expect(retrieved).toEqual(goal)
  })

  it('lists saved goals', async () => {
    const goal1: AcademicGoal = {
      id: 'g1',
      title: 'Target GPA',
      targetType: 'gpa',
      targetValue: 3.5,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const goal2: AcademicGoal = {
      id: 'g2',
      title: 'Credits',
      targetType: 'credits',
      targetValue: 30,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await repository.save(goal1)
    await repository.save(goal2)

    const list = await repository.list()
    expect(list.length).toBeGreaterThanOrEqual(2)
    const ids = list.map((g) => g.id)
    expect(ids).toContain('g1')
    expect(ids).toContain('g2')
  })

  it('rejects invalid goals from persistence', async () => {
    // Force a save through the DB bypassing repo validation
    await database.save('goals', { id: 'g3', title: '' }) // missing required fields

    await expect(repository.get('g3')).rejects.toThrow()
  })
})

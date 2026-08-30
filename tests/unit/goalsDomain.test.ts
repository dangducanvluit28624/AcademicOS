import { describe, it, expect } from 'vitest'
import { validateAcademicGoal } from '../../src/domain/goals'
import type { AcademicGoal } from '../../src/domain/goals'

describe('Academic Goal Domain', () => {
  it('validates a valid GPA goal', () => {
    const goal: AcademicGoal = {
      id: 'g1',
      title: 'Target GPA',
      targetType: 'gpa',
      targetValue: 3.5,
      status: 'active',
      createdAt: '2026-08-28T00:00:00Z',
      updatedAt: '2026-08-28T00:00:00Z',
    }
    expect(() => validateAcademicGoal(goal)).not.toThrow()
  })

  it('rejects an invalid GPA value', () => {
    const goal: AcademicGoal = {
      id: 'g1',
      title: 'Target GPA',
      targetType: 'gpa',
      targetValue: 5.0, // GPA > 4.0
      status: 'active',
      createdAt: '2026-08-28T00:00:00Z',
      updatedAt: '2026-08-28T00:00:00Z',
    }
    expect(() => validateAcademicGoal(goal)).toThrow(/cannot exceed 4.0/)
  })

  it('validates a graduation-credits goal with a program', () => {
    const goal: AcademicGoal = {
      id: 'g2',
      title: 'Graduate',
      targetType: 'graduation-credits',
      targetValue: 120,
      academicProgramId: 'p1',
      status: 'active',
      createdAt: '2026-08-28T00:00:00Z',
      updatedAt: '2026-08-28T00:00:00Z',
    }
    expect(() => validateAcademicGoal(goal)).not.toThrow()
  })

  it('rejects a graduation-credits goal without a program', () => {
    const goal: AcademicGoal = {
      id: 'g2',
      title: 'Graduate',
      targetType: 'graduation-credits',
      targetValue: 120,
      status: 'active',
      createdAt: '2026-08-28T00:00:00Z',
      updatedAt: '2026-08-28T00:00:00Z',
    }
    expect(() => validateAcademicGoal(goal)).toThrow(
      /requires a valid academicProgramId/,
    )
  })

  it('rejects negative target values', () => {
    const goal: AcademicGoal = {
      id: 'g3',
      title: 'Credits',
      targetType: 'credits',
      targetValue: -10,
      status: 'active',
      createdAt: '2026-08-28T00:00:00Z',
      updatedAt: '2026-08-28T00:00:00Z',
    }
    expect(() => validateAcademicGoal(goal)).toThrow(/non-negative/)
  })

  it('rejects empty title', () => {
    const goal: AcademicGoal = {
      id: 'g4',
      title: '  ',
      targetType: 'credits',
      targetValue: 10,
      status: 'active',
      createdAt: '2026-08-28T00:00:00Z',
      updatedAt: '2026-08-28T00:00:00Z',
    }
    expect(() => validateAcademicGoal(goal)).toThrow(/non-empty string/)
  })
})

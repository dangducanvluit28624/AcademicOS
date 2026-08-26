import { describe, expect, it } from 'vitest'
import {
  getDashboardSummary,
  type AnalyticsRepositories,
} from '../../src/application'

function repository<T extends { id: string }>(items: T[]) {
  return {
    get: async (id: string) => items.find((item) => item.id === id),
    list: async () => items,
    save: async (item: T) => {
      const index = items.findIndex((current) => current.id === item.id)
      if (index === -1) items.push(item)
      else items[index] = item
    },
  }
}

function createRepositories(): AnalyticsRepositories {
  const profiles = [{ id: 'profile', name: 'Student', overallGpa: 3.2 }]
  const programs = [{ id: 'program', name: 'Program', totalRequiredCredits: 6 }]
  const years = [{ id: 'year', label: '2026' }]
  const semesters = [
    {
      id: 'semester',
      academicYearId: 'year',
      name: 'Fall',
      startDate: '2026-09-01',
      status: 'completed' as const,
    },
  ]
  const subjects = [{ id: 'subject', name: 'Subject', credits: 3 }]
  const enrollments = [
    {
      id: 'enrollment',
      subjectId: 'subject',
      semesterId: 'semester',
      status: 'completed' as const,
    },
  ]
  const grades = [
    {
      id: 'grade',
      enrollmentId: 'enrollment',
      value: '8.0',
      originalScore: 8,
      letterGrade: 'B',
      fourPointValue: 3,
      finalized: true,
    },
  ]
  return {
    profiles: repository(profiles),
    programs: repository(programs),
    years: repository(years),
    semesters: repository(semesters),
    subjects: repository(subjects),
    enrollments: repository(enrollments),
    grades: repository(grades),
  }
}

describe('M3 application analytics', () => {
  it('keeps official GPA separate and recalculates after an authoritative grade update', async () => {
    const repositories = createRepositories()
    const before = await getDashboardSummary(repositories)
    expect(before.profile?.overallGpa).toBe(3.2)
    expect(before.calculatedGpa.value).toBe(3)

    await repositories.grades.save({
      ...(await repositories.grades.get('grade'))!,
      value: '10.0',
      originalScore: 10,
      letterGrade: 'A+',
      fourPointValue: 4,
    })

    const after = await getDashboardSummary(repositories)
    expect(after.profile?.overallGpa).toBe(3.2)
    expect(after.calculatedGpa.value).toBe(4)
    expect(after.sourceRecords.grades).toHaveLength(1)
  })

  it('reports missing relationships instead of silently presenting a complete dataset', async () => {
    const repositories = createRepositories()
    await repositories.enrollments.save({
      id: 'orphan-enrollment',
      subjectId: 'missing-subject',
      semesterId: 'semester',
      status: 'completed',
    })

    const summary = await getDashboardSummary(repositories)
    expect(summary.integrityIssueRecordIds).toContain('orphan-enrollment')
    expect(summary.calculatedGpa.status).toBe('Data integrity issue')
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AcademicService } from '../../src/application/academicServices'
import type { AnalyticsRepositories } from '../../src/application/analytics'
import type { PlannerRepositories } from '../../src/application/planner'
import type { Subject, Enrollment, Task } from '../../src/domain'

describe('AcademicService', () => {
  let academicService: AcademicService
  let mockAcademicRepos: AnalyticsRepositories
  let mockPlannerRepos: PlannerRepositories

  beforeEach(() => {
    mockAcademicRepos = {
      profiles: { get: vi.fn(), list: vi.fn(), save: vi.fn(), delete: vi.fn() },
      programs: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      years: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      semesters: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      subjects: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      enrollments: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      grades: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
    }
    mockPlannerRepos = {
      tasks: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      events: {
        get: vi.fn(),
        list: vi.fn().mockResolvedValue([]),
        save: vi.fn(),
        delete: vi.fn(),
      },
      subjects: mockAcademicRepos.subjects,
    }
    academicService = new AcademicService(mockAcademicRepos, mockPlannerRepos)
  })

  describe('Subjects', () => {
    it('prevents saving duplicate subjects', async () => {
      mockAcademicRepos.subjects.list = vi
        .fn()
        .mockResolvedValue([{ id: '1', name: 'Math', credits: 3 }])
      const newSubject: Subject = { id: '2', name: 'Math', credits: 4 }
      await expect(academicService.saveSubject(newSubject)).rejects.toThrow(
        'A subject with this name or code already exists',
      )
    })

    it('allows archiving a subject', async () => {
      const existing: Subject = { id: '1', name: 'Math', credits: 3 }
      mockAcademicRepos.subjects.get = vi.fn().mockResolvedValue(existing)
      await academicService.archiveSubject('1')
      expect(mockAcademicRepos.subjects.save).toHaveBeenCalledWith({
        ...existing,
        archived: true,
      })
    })

    it('prevents deleting subject if referenced by enrollment', async () => {
      mockAcademicRepos.enrollments.list = vi.fn().mockResolvedValue([
        {
          id: 'e1',
          subjectId: '1',
          semesterId: 's1',
          status: 'planned',
        } as Enrollment,
      ])
      await expect(academicService.deleteSubject('1')).rejects.toThrow(
        'Cannot delete subject because it is referenced by one or more enrollments',
      )
    })

    it('prevents deleting subject if referenced by tasks', async () => {
      mockAcademicRepos.enrollments.list = vi.fn().mockResolvedValue([])
      mockPlannerRepos.tasks.list = vi.fn().mockResolvedValue([
        {
          id: 't1',
          title: 'Task',
          subjectId: '1',
          status: 'pending',
        } as Task,
      ])
      await expect(academicService.deleteSubject('1')).rejects.toThrow(
        'Cannot delete subject because it is referenced by one or more tasks',
      )
    })

    it('allows deleting subject if not referenced', async () => {
      mockAcademicRepos.enrollments.list = vi.fn().mockResolvedValue([])
      mockPlannerRepos.tasks.list = vi.fn().mockResolvedValue([])
      mockPlannerRepos.events.list = vi.fn().mockResolvedValue([])
      await academicService.deleteSubject('1')
      expect(mockAcademicRepos.subjects.delete).toHaveBeenCalledWith('1')
    })
  })

  describe('Enrollments', () => {
    it('prevents new enrollments for archived subjects', async () => {
      mockAcademicRepos.subjects.get = vi.fn().mockResolvedValue({
        id: 'sub1',
        name: 'Math',
        credits: 3,
        archived: true,
      } as Subject)
      mockAcademicRepos.enrollments.list = vi.fn().mockResolvedValue([])

      const newEnrollment: Enrollment = {
        id: 'new-e',
        subjectId: 'sub1',
        semesterId: 'sem1',
        status: 'planned',
      }
      await expect(
        academicService.saveEnrollment(newEnrollment),
      ).rejects.toThrow(
        'Cannot create a new enrollment for an archived subject',
      )
    })

    it('allows editing an existing enrollment for an archived subject', async () => {
      mockAcademicRepos.enrollments.list = vi.fn().mockResolvedValue([
        {
          id: 'e1',
          subjectId: 'sub1',
          semesterId: 'sem1',
          status: 'planned',
        },
      ])
      mockAcademicRepos.subjects.get = vi.fn().mockResolvedValue({
        id: 'sub1',
        name: 'Math',
        credits: 3,
        archived: true,
      } as Subject)

      const updateEnrollment: Enrollment = {
        id: 'e1',
        subjectId: 'sub1',
        semesterId: 'sem1',
        status: 'completed',
      }
      await expect(
        academicService.saveEnrollment(updateEnrollment),
      ).resolves.not.toThrow()
      expect(mockAcademicRepos.enrollments.save).toHaveBeenCalledWith(
        updateEnrollment,
      )
    })
  })

  describe('Semesters', () => {
    it('prevents deleting semester if referenced by enrollments', async () => {
      mockAcademicRepos.enrollments.list = vi.fn().mockResolvedValue([
        {
          id: 'e1',
          subjectId: 'sub1',
          semesterId: 'sem1',
          status: 'planned',
        } as Enrollment,
      ])
      await expect(academicService.deleteSemester('sem1')).rejects.toThrow(
        'Cannot delete semester because it is referenced by one or more enrollments',
      )
    })
  })
})

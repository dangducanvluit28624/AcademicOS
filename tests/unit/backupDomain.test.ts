import { describe, expect, it } from 'vitest'
import {
  validateBackupEnvelope,
  validateBackupData,
  validateCrossReferences,
} from '../../src/domain/backup'

describe('M5 backup domain validation', () => {
  it('validates a correct backup envelope', () => {
    const validEnvelope = {
      formatVersion: 1,
      application: { name: 'Academic OS' },
      database: { schemaVersion: 4 },
      createdAt: '2026-01-01T00:00:00.000Z',
      data: {
        studentProfiles: [],
        academicPrograms: [],
        academicYears: [],
        semesters: [],
        subjects: [],
        enrollments: [],
        grades: [],
        tasks: [],
        academicEvents: [],
        goals: [],
      },
    }
    expect(() => validateBackupEnvelope(validEnvelope)).not.toThrow()
  })

  it('rejects unsupported format version', () => {
    const invalidEnvelope = {
      formatVersion: 2,
      application: { name: 'Academic OS' },
      database: { schemaVersion: 4 },
      createdAt: '2026-01-01T00:00:00.000Z',
      data: {},
    }
    expect(() => validateBackupEnvelope(invalidEnvelope)).toThrow(
      'Unsupported backup format version: 2',
    )
  })

  it('rejects unsupported schema version', () => {
    const invalidEnvelope = {
      formatVersion: 1,
      application: { name: 'Academic OS' },
      database: { schemaVersion: 6 },
      createdAt: '2026-01-01T00:00:00.000Z',
      data: {},
    }
    expect(() => validateBackupEnvelope(invalidEnvelope)).toThrow(
      'Unsupported database schema version: 6',
    )
  })

  it('validates data structures', () => {
    const invalidData = {
      studentProfiles: [],
      academicPrograms: [],
      academicYears: [],
      semesters: [],
      subjects: [],
      enrollments: [],
      grades: [],
      tasks: {}, // Not an array
      academicEvents: [],
      goals: [],
    }
    expect(() =>
      validateBackupData(invalidData as unknown as BackupData),
    ).toThrow('tasks must be an array')
  })

  it('validates record properties', () => {
    const invalidData = {
      studentProfiles: [{ id: 'p1', name: '' }], // Empty name invalid
      academicPrograms: [],
      academicYears: [],
      semesters: [],
      subjects: [],
      enrollments: [],
      grades: [],
      tasks: [],
      academicEvents: [],
      goals: [],
    }
    expect(() =>
      validateBackupData(invalidData as unknown as BackupData),
    ).toThrow('Student profile name is required')
  })

  it('validates cross-references', () => {
    const dataWithBrokenReference = {
      studentProfiles: [],
      academicPrograms: [],
      academicYears: [],
      semesters: [],
      subjects: [],
      enrollments: [
        {
          id: 'e1',
          subjectId: 'missing-subject',
          semesterId: 'missing-semester',
          status: 'planned' as const,
        },
      ],
      grades: [],
      tasks: [],
      academicEvents: [],
      goals: [],
    }
    expect(() => validateCrossReferences(dataWithBrokenReference)).toThrow(
      'Enrollment e1 references missing subject missing-subject',
    )
  })
})

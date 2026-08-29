import type { AnalyticsRepositories } from './index'
import type { PlannerRepositories } from './planner'
import type { PersistenceDatabase } from './ports/persistence'
import type { BackupEnvelope } from '../domain'
import {
  validateBackupEnvelope,
  validateBackupData,
  validateCrossReferences,
} from '../domain'

export async function createBackup(
  repositories: AnalyticsRepositories,
  plannerRepositories: PlannerRepositories,
): Promise<BackupEnvelope> {
  const [
    studentProfiles,
    academicPrograms,
    academicYears,
    semesters,
    subjects,
    enrollments,
    grades,
    tasks,
    academicEvents,
  ] = await Promise.all([
    repositories.profiles.list(),
    repositories.programs.list(),
    repositories.years.list(),
    repositories.semesters.list(),
    repositories.subjects.list(),
    repositories.enrollments.list(),
    repositories.grades.list(),
    plannerRepositories.tasks.list(),
    plannerRepositories.events.list(),
  ])

  return {
    formatVersion: 1,
    application: {
      name: 'Academic OS',
    },
    database: {
      schemaVersion: 4,
    },
    createdAt: new Date().toISOString(),
    data: {
      studentProfiles,
      academicPrograms,
      academicYears,
      semesters,
      subjects,
      enrollments,
      grades,
      tasks,
      academicEvents,
    },
  }
}

export function validateBackup(jsonString: string): BackupEnvelope {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error('Backup is not valid JSON')
  }

  validateBackupEnvelope(parsed)
  validateBackupData(parsed.data)
  validateCrossReferences(parsed.data)

  return parsed
}

export interface BackupPreview {
  formatVersion: number
  schemaVersion: number
  createdAt: string
  counts: {
    studentProfiles: number
    academicPrograms: number
    academicYears: number
    semesters: number
    subjects: number
    enrollments: number
    grades: number
    tasks: number
    academicEvents: number
  }
}

export function inspectBackup(envelope: BackupEnvelope): BackupPreview {
  return {
    formatVersion: envelope.formatVersion,
    schemaVersion: envelope.database.schemaVersion,
    createdAt: envelope.createdAt,
    counts: {
      studentProfiles: envelope.data.studentProfiles.length,
      academicPrograms: envelope.data.academicPrograms.length,
      academicYears: envelope.data.academicYears.length,
      semesters: envelope.data.semesters.length,
      subjects: envelope.data.subjects.length,
      enrollments: envelope.data.enrollments.length,
      grades: envelope.data.grades.length,
      tasks: envelope.data.tasks.length,
      academicEvents: envelope.data.academicEvents.length,
    },
  }
}

export async function restoreBackup(
  envelope: BackupEnvelope,
  database: PersistenceDatabase,
): Promise<void> {
  // Validate data one more time just in case
  validateBackupData(envelope.data)
  validateCrossReferences(envelope.data)

  await database.replaceData(
    envelope.data as unknown as Record<string, unknown[]>,
  )
}

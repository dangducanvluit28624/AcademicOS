import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type {
  AnalyticsRepositories,
  DashboardSummary,
  PlannerRepositories,
} from '../../application'
import type { GoalRepositories } from '../../application/ports/goalRepositories'
import type { PersistenceDatabase } from '../../application/ports/persistence'
import { getDashboardSummary, AcademicService } from '../../application'
import { BackupRestore } from '../backup/BackupRestore'
import { GoalsDashboard } from '../goals/GoalsDashboard'
import { useHashRouter } from './useHashRouter'
import { Navigation } from './Navigation'
import { Dashboard } from '../dashboard/Dashboard'
import { AcademicsLayout } from '../academics/AcademicsLayout'
import { ProfileView } from '../academics/ProfileView'
import { ProgramView } from '../academics/ProgramView'
import { AcademicYearView } from '../academics/AcademicYearView'
import { SemesterView } from '../academics/SemesterView'
import { SubjectView } from '../academics/SubjectView'
import { EnrollmentView } from '../academics/EnrollmentView'
import { GradeView } from '../academics/GradeView'

export interface AppProps {
  repositories: AnalyticsRepositories
  plannerRepositories: PlannerRepositories
  goalRepositories: GoalRepositories
  database: PersistenceDatabase
  planner?: ReactNode
}

export function App({
  repositories,
  plannerRepositories,
  goalRepositories,
  database,
  planner,
}: AppProps) {
  const { hash, navigate } = useHashRouter('#dashboard')
  const [dashboard, setDashboard] = useState<DashboardSummary>()

  const academicService = new AcademicService(repositories, plannerRepositories)

  const reload = useCallback(async () => {
    const nextDashboard = await getDashboardSummary(repositories)
    setDashboard(nextDashboard)
  }, [repositories])

  useEffect(() => {
    void reload()
  }, [reload])

  const [baseRoute, subRoute] = hash.replace(/^#/, '').split('/')

  const records = dashboard?.sourceRecords

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <header>
        <p>ACADEMIC OS</p>
        <h1>Academic OS</h1>
        <h2>Academic record workspace</h2>
        <p>
          Persist your academic history locally, with official course conversion
          and user-provided GPA.
        </p>
      </header>

      <Navigation currentHash={hash} onNavigate={navigate} />

      {baseRoute === 'dashboard' && <Dashboard dashboard={dashboard} />}

      {baseRoute === 'academics' && records && (
        <AcademicsLayout
          currentSubRoute={subRoute}
          onNavigate={(sub) => navigate(`#academics/${sub}`)}
        >
          {(!subRoute || subRoute === 'profile') && (
            <ProfileView
              profiles={records.profiles}
              academicService={academicService}
              onReload={reload}
            />
          )}
          {subRoute === 'programs' && (
            <ProgramView
              programs={records.programs}
              academicService={academicService}
              onReload={reload}
            />
          )}
          {subRoute === 'years' && (
            <AcademicYearView
              years={records.years}
              academicService={academicService}
              onReload={reload}
            />
          )}
          {subRoute === 'semesters' && (
            <SemesterView
              semesters={records.semesters}
              years={records.years}
              academicService={academicService}
              onReload={reload}
            />
          )}
          {subRoute === 'subjects' && (
            <SubjectView
              subjects={records.subjects}
              academicService={academicService}
              onReload={reload}
            />
          )}
          {subRoute === 'enrollments' && (
            <EnrollmentView
              enrollments={records.enrollments}
              subjects={records.subjects}
              semesters={records.semesters}
              academicService={academicService}
              onReload={reload}
            />
          )}
          {subRoute === 'grades' && (
            <GradeView
              grades={records.grades}
              enrollments={records.enrollments}
              academicService={academicService}
              onReload={reload}
            />
          )}
        </AcademicsLayout>
      )}

      {baseRoute === 'planner' && (
        <section>
          {planner}
        </section>
      )}

      {baseRoute === 'goals' && (
        <section>
          <GoalsDashboard
            analyticsRepositories={repositories}
            goalRepositories={goalRepositories}
          />
        </section>
      )}

      {baseRoute === 'backup' && (
        <section>
          <h2>Backup & Restore</h2>
          <BackupRestore
            repositories={repositories}
            plannerRepositories={plannerRepositories}
            goalRepositories={goalRepositories}
            database={database}
            onRestoreComplete={reload}
          />
        </section>
      )}
    </main>
  )
}

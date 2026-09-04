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
import { Menu, GraduationCap, ShieldCheck } from 'lucide-react'

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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

  const studentName = dashboard?.profile?.name

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex font-sans">
      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <Navigation
        currentHash={hash}
        onNavigate={navigate}
        studentName={studentName}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white border-b border-slate-200/90 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h1 className="text-sm font-bold text-slate-900">Academic OS</h1>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-2.5 h-2.5" /> Offline
          </span>
        </header>

        {/* Top Breadcrumb Context Banner on Large Screens */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white/70 backdrop-blur-xs border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
              Academic Workspace
            </span>
            <span>/</span>
            <span className="capitalize font-medium text-indigo-600">
              {baseRoute || 'Dashboard'}
            </span>
            {subRoute && (
              <>
                <span>/</span>
                <span className="capitalize font-medium text-slate-700">
                  {subRoute}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Route Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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

          {baseRoute === 'planner' && <section>{planner}</section>}

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

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white/50 text-slate-400 text-xs py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>Academic OS • Modern Offline-First Academic Record Workspace</p>
        </footer>
      </div>
    </div>
  )
}

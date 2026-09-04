import React from 'react'
import type { DashboardSummary } from '../../application'
import { Card } from '../components/Card'
import { StatCard } from '../components/StatCard'
import { StatusBadge, Badge } from '../components/Badge'
import { ProgressBar } from '../components/ProgressBar'
import { AlertBanner } from '../components/AlertBanner'
import {
  GraduationCap,
  Calculator,
  Award,
  Calendar,
  Activity,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  CalendarRange,
} from 'lucide-react'

function describeAnalyticsStatus(status: string): string {
  if (status === 'Incomplete')
    return 'Required academic information is missing or unresolved.'
  if (status === 'Unavailable')
    return 'This metric cannot be calculated from the available information.'
  if (status === 'Data integrity issue')
    return 'Academic data needs review because source records conflict or are invalid.'
  return 'This calculation uses sufficient valid academic data.'
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export interface DashboardProps {
  dashboard?: DashboardSummary
}

export function Dashboard({ dashboard }: DashboardProps) {
  const calculatedGpaValue =
    dashboard?.calculatedGpa.status === 'Available'
      ? dashboard.calculatedGpa.value?.toFixed(2)
      : (dashboard?.calculatedGpa.status ?? 'Unavailable')

  const officialGpaText =
    dashboard?.profile?.overallGpa !== undefined
      ? `${dashboard.profile.overallGpa}`
      : 'Not provided'

  const completedCredits = dashboard?.creditProgress.completedCredits ?? 0
  const attemptedCredits = dashboard?.creditProgress.attemptedCredits ?? 0
  const remainingCredits =
    dashboard?.creditProgress.remainingCredits !== undefined
      ? dashboard.creditProgress.remainingCredits
      : 'Unavailable'

  const completionPct =
    dashboard?.creditProgress.completionPercentage !== undefined
      ? `${dashboard.creditProgress.completionPercentage.toFixed(2)}%`
      : 'Unavailable'

  const currentSemesterName = dashboard?.currentSemester?.name ?? 'Not selected'

  const currentProgramName =
    dashboard?.program?.name ??
    dashboard?.sourceRecords?.programs?.[0]?.name ??
    'Academic Degree'

  const currentYearLabel =
    dashboard?.sourceRecords?.years?.[0]?.label ?? 'Academic Year'

  const gpaStatus = dashboard?.calculatedGpa.status ?? 'Unavailable'
  const trendStatus = dashboard?.trends.status ?? 'Unavailable'
  const greeting = getGreeting()
  const studentName = dashboard?.profile?.name

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-6">
      {/* Contextual Greeting Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
                {greeting}
                {studentName ? `, ${studentName}` : ''}
              </span>
              <span className="w-1 h-1 rounded-full bg-indigo-300" />
              <span className="text-xs text-indigo-200">
                Your Academic Overview
              </span>
            </div>
            <h1
              id="dashboard-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
            >
              Academic dashboard
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-xl">
              Real-time calculations for cumulative GPA, degree credit progress,
              and semester trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-white">
              <BookOpen className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span className="font-medium truncate max-w-[150px]">
                {currentProgramName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-white">
              <CalendarRange className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span className="font-medium">{currentYearLabel}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-white">
              <Calendar className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
              <span className="font-medium">{currentSemesterName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Data Integrity Alert */}
      {dashboard?.integrityIssueRecordIds &&
      dashboard.integrityIssueRecordIds.length > 0 ? (
        <AlertBanner type="error" title="Data Integrity Alert" role="alert">
          Academic data needs review for{' '}
          {dashboard.integrityIssueRecordIds.length} source record(s). Check
          unresolved courses or conflicting semester associations in Academics.
        </AlertBanner>
      ) : null}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Official GPA"
          value={`Official GPA: ${officialGpaText}`}
          icon={<GraduationCap className="w-4 h-4 text-indigo-600" />}
          subtext={
            <span className="text-slate-500">Student profile provided GPA</span>
          }
        />

        <StatCard
          label="Calculated GPA"
          value={`Calculated GPA: ${calculatedGpaValue}`}
          badge={<StatusBadge status={gpaStatus} />}
          icon={<Calculator className="w-4 h-4 text-blue-600" />}
          subtext={
            <span className="text-slate-500">
              Weighted by course credits & score
            </span>
          }
        />

        <StatCard
          label="Credit Progress"
          value={`Credit progress: ${completedCredits} completed / ${attemptedCredits} attempted${
            dashboard?.creditProgress.remainingCredits !== undefined
              ? ` / ${dashboard.creditProgress.remainingCredits} remaining`
              : ''
          }`}
          icon={<Award className="w-4 h-4 text-emerald-600" />}
          subtext={
            <div className="w-full mt-1">
              <div className="text-xs text-slate-500 mb-1 flex items-center justify-between flex-wrap gap-1">
                <span>Completed credits: {completedCredits}</span>
                <span>Remaining credits: {remainingCredits}</span>
                <span>Completion percentage: {completionPct}</span>
              </div>
              {dashboard?.creditProgress.completionPercentage !== undefined && (
                <ProgressBar
                  value={dashboard.creditProgress.completionPercentage}
                  size="sm"
                  variant="success"
                  showPercentage={false}
                />
              )}
            </div>
          }
        />

        <StatCard
          label="Current Semester"
          value={`Current semester: ${currentSemesterName}`}
          icon={<Calendar className="w-4 h-4 text-amber-600" />}
          subtext={<span className="text-slate-500">Active academic term</span>}
        />
      </div>

      {/* Quality Context Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>GPA status: {gpaStatus}.</strong>{' '}
            {describeAnalyticsStatus(gpaStatus)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            <strong>Trend status: {trendStatus}.</strong>{' '}
            {describeAnalyticsStatus(trendStatus)}
          </span>
        </div>
      </div>

      {/* Trends & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-3 overflow-hidden"
          title="GPA & Credit Progression"
          subtitle="Cumulative progression points tracked across completed academic terms"
          icon={<TrendingUp className="w-4 h-4 text-indigo-600" />}
        >
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <caption className="sr-only">GPA and credit trends</caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Completed credits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard?.trends.points &&
                dashboard.trends.points.length > 0 ? (
                  dashboard.trends.points.map((trend) => (
                    <tr
                      key={trend.semesterId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-medium text-slate-800">
                        {trend.semesterLabel}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-semibold text-indigo-700">
                        {trend.gpa.value?.toFixed(2) ?? trend.gpa.status}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-700">
                        {trend.accumulatedCompletedCredits} credits
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-xs text-slate-400"
                    >
                      No historical progression data recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Performance Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Performance */}
        <Card
          title="Semester Performance"
          subtitle="Detailed credit completion and pass/fail summary by semester"
          icon={<Calendar className="w-4 h-4 text-blue-600" />}
        >
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <caption className="sr-only">Semester performance</caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Attempted credits
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Completed credits
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Completed subjects
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Failed subjects
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard?.semesterPerformance &&
                dashboard.semesterPerformance.length > 0 ? (
                  dashboard.semesterPerformance.map((performance) => (
                    <tr
                      key={performance.semester.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {performance.semester.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-700">
                        {performance.gpa.value?.toFixed(2) ??
                          performance.gpa.status}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {performance.attemptedCredits}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                        {performance.completedCredits}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <Badge variant="success" size="sm">
                          {performance.completedSubjectCount}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {performance.failedSubjectCount > 0 ? (
                          <Badge variant="danger" size="sm">
                            {performance.failedSubjectCount}
                          </Badge>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-xs text-slate-400"
                    >
                      No semester performance records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Subject Performance */}
        <Card
          title="Subject Performance"
          subtitle="Individual course enrollment status and finalized grades"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        >
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <caption className="sr-only">Subject performance</caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard?.subjectPerformance &&
                dashboard.subjectPerformance.length > 0 ? (
                  dashboard.subjectPerformance.map((item) => (
                    <tr
                      key={item.enrollment.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.subject.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.semester.name}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4">
                        {item.grade?.letterGrade ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono">
                            {item.grade.letterGrade}
                            {item.grade.fourPointValue !== undefined && (
                              <span className="text-slate-400 font-normal ml-1">
                                ({item.grade.fourPointValue.toFixed(1)})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Not available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-xs text-slate-400"
                    >
                      No subject enrollment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}

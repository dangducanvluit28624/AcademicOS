import type { DashboardSummary } from '../../application'

function describeAnalyticsStatus(status: string): string {
  if (status === 'Incomplete')
    return 'Required academic information is missing or unresolved.'
  if (status === 'Unavailable')
    return 'This metric cannot be calculated from the available information.'
  if (status === 'Data integrity issue')
    return 'Academic data needs review because source records conflict or are invalid.'
  return 'This calculation uses sufficient valid academic data.'
}

export interface DashboardProps {
  dashboard?: DashboardSummary
}

export function Dashboard({ dashboard }: DashboardProps) {
  return (
    <section aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading">Academic dashboard</h2>
      <p>Official GPA: {dashboard?.profile?.overallGpa ?? 'Not provided'}</p>
      <p>
        Calculated GPA:{' '}
        {dashboard?.calculatedGpa.status === 'Available'
          ? dashboard.calculatedGpa.value?.toFixed(2)
          : (dashboard?.calculatedGpa.status ?? 'Unavailable')}
      </p>
      <p>
        Credit progress: {dashboard?.creditProgress.completedCredits ?? 0}{' '}
        completed / {dashboard?.creditProgress.attemptedCredits ?? 0} attempted
        {dashboard?.creditProgress.remainingCredits !== undefined &&
          ` / ${dashboard.creditProgress.remainingCredits} remaining`}
      </p>
      <p>
        Remaining credits:{' '}
        {dashboard?.creditProgress.remainingCredits ?? 'Unavailable'}
      </p>
      <p>
        Completion percentage:{' '}
        {dashboard?.creditProgress.completionPercentage !== undefined
          ? `${dashboard.creditProgress.completionPercentage.toFixed(2)}%`
          : 'Unavailable'}
      </p>
      <p>
        GPA status: {dashboard?.calculatedGpa.status ?? 'Unavailable'}.{' '}
        {describeAnalyticsStatus(
          dashboard?.calculatedGpa.status ?? 'Unavailable',
        )}
      </p>
      <p>
        Current semester: {dashboard?.currentSemester?.name ?? 'Not selected'}
      </p>
      {dashboard?.integrityIssueRecordIds.length ? (
        <p role="alert">
          Academic data needs review for{' '}
          {dashboard.integrityIssueRecordIds.length} source record(s).
        </p>
      ) : null}
      <table>
        <caption>GPA and credit trends</caption>
        <thead>
          <tr>
            <th>Semester</th>
            <th>GPA</th>
            <th>Completed credits</th>
          </tr>
        </thead>
        <tbody>
          {dashboard?.trends.points.map((trend) => (
            <tr key={trend.semesterId}>
              <td>{trend.semesterLabel}</td>
              <td>{trend.gpa.value?.toFixed(2) ?? trend.gpa.status}</td>
              <td>{trend.accumulatedCompletedCredits}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Trend status: {dashboard?.trends.status ?? 'Unavailable'}.{' '}
        {describeAnalyticsStatus(dashboard?.trends.status ?? 'Unavailable')}
      </p>
      <table>
        <caption>Semester performance</caption>
        <thead>
          <tr>
            <th>Semester</th>
            <th>GPA</th>
            <th>Attempted credits</th>
            <th>Completed credits</th>
            <th>Completed subjects</th>
            <th>Failed subjects</th>
          </tr>
        </thead>
        <tbody>
          {dashboard?.semesterPerformance.map((performance) => (
            <tr key={performance.semester.id}>
              <td>{performance.semester.name}</td>
              <td>
                {performance.gpa.value?.toFixed(2) ?? performance.gpa.status}
              </td>
              <td>{performance.attemptedCredits}</td>
              <td>{performance.completedCredits}</td>
              <td>{performance.completedSubjectCount}</td>
              <td>{performance.failedSubjectCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table>
        <caption>Subject performance</caption>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Semester</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {dashboard?.subjectPerformance.map((item) => (
            <tr key={item.enrollment.id}>
              <td>{item.subject.name}</td>
              <td>{item.semester.name}</td>
              <td>{item.status}</td>
              <td>{item.grade?.letterGrade ?? 'Not available'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

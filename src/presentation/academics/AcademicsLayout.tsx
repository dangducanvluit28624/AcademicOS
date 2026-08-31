export interface AcademicsLayoutProps {
  currentSubRoute: string
  onNavigate: (subRoute: string) => void
  children: React.ReactNode
}

export function AcademicsLayout({
  currentSubRoute,
  onNavigate,
  children,
}: AcademicsLayoutProps) {
  const tabs = [
    { label: 'Profile', id: 'profile' },
    { label: 'Programs', id: 'programs' },
    { label: 'Years', id: 'years' },
    { label: 'Semesters', id: 'semesters' },
    { label: 'Subjects', id: 'subjects' },
    { label: 'Enrollments', id: 'enrollments' },
    { label: 'Grades', id: 'grades' },
  ]

  const activeTab = currentSubRoute || 'profile'

  return (
    <section>
      <h2>Academic Management</h2>
      <nav
        aria-label="Academics sub-navigation"
        style={{ marginBottom: '16px' }}
      >
        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((tab) => (
            <li key={tab.id}>
              <a
                href={`#academics/${tab.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(tab.id)
                }}
                style={{
                  textDecoration: activeTab === tab.id ? 'underline' : 'none',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  color: '#0056b3',
                }}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ marginTop: '24px' }}>{children}</div>
    </section>
  )
}

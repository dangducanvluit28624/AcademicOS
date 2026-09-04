import React from 'react'
import {
  UserCircle,
  BookOpen,
  CalendarDays,
  Clock,
  BookMarked,
  ClipboardList,
  Award,
} from 'lucide-react'

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
    { label: 'Profile', id: 'profile', icon: UserCircle },
    { label: 'Programs', id: 'programs', icon: BookOpen },
    { label: 'Years', id: 'years', icon: CalendarDays },
    { label: 'Semesters', id: 'semesters', icon: Clock },
    { label: 'Subjects', id: 'subjects', icon: BookMarked },
    { label: 'Enrollments', id: 'enrollments', icon: ClipboardList },
    { label: 'Grades', id: 'grades', icon: Award },
  ]

  const activeTab = currentSubRoute || 'profile'

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Academic Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure programs, semesters, courses, enrollments, and official
            grade records.
          </p>
        </div>
      </div>

      <nav
        aria-label="Academics sub-navigation"
        className="bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80 shadow-2xs overflow-x-auto no-scrollbar"
      >
        <ul className="flex items-center gap-1 list-none m-0 p-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <li key={tab.id}>
                <a
                  href={`#academics/${tab.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate(tab.id)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-indigo-700 font-semibold shadow-2xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  style={{
                    textDecoration: 'none',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-6">{children}</div>
    </section>
  )
}

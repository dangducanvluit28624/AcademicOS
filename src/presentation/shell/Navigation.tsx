import React from 'react'
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  Target,
  HardDriveDownload,
  UserCircle,
  ShieldCheck,
  Database,
  X,
} from 'lucide-react'

export interface NavigationProps {
  currentHash: string
  onNavigate: (hash: string) => void
  studentName?: string
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function Navigation({
  currentHash,
  onNavigate,
  studentName,
  mobileOpen = false,
  onCloseMobile,
}: NavigationProps) {
  const primaryItems = [
    { label: 'Dashboard', hash: '#dashboard', icon: LayoutDashboard },
    { label: 'Academics', hash: '#academics', icon: GraduationCap },
    { label: 'Planner', hash: '#planner', icon: CalendarCheck },
    { label: 'Goals', hash: '#goals', icon: Target },
    { label: 'Backup/Restore', hash: '#backup', icon: HardDriveDownload },
  ]

  const activeHash = currentHash.split('/')[0]
  const isProfileActive = currentHash === '#academics/profile'

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      <div className="space-y-6">
        {/* Brand / Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                  Workspace
                </span>
                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-2.5 h-2.5" /> Offline
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none mt-0.5">
                Academic OS
              </h1>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </p>
          <nav aria-label="Main navigation">
            <ul className="space-y-1 list-none p-0 m-0">
              {primaryItems.map((item) => {
                const isActive = activeHash === item.hash
                const Icon = item.icon
                return (
                  <li key={item.hash}>
                    <a
                      href={item.hash}
                      onClick={(e) => {
                        e.preventDefault()
                        onNavigate(item.hash)
                        onCloseMobile?.()
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                      style={{
                        textDecoration: 'none',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-indigo-600'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Secondary Navigation & Footer Status */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Account & Student
          </p>
          <button
            type="button"
            onClick={() => {
              onNavigate('#academics/profile')
              onCloseMobile?.()
            }}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isProfileActive
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                {studentName ? (
                  studentName.charAt(0).toUpperCase()
                ) : (
                  <UserCircle className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {studentName || 'Student Profile'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  View academic record
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* System info badge */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-between text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              Your data stays on this device
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            100% private in-browser persistence.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/90 z-30 shadow-2xs">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  )
}

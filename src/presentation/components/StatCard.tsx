import React from 'react'

export interface StatCardProps {
  label: string
  value: React.ReactNode
  subtext?: React.ReactNode
  icon?: React.ReactNode
  badge?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  badge,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtext && (
          <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
            {subtext}
          </div>
        )}
      </div>
    </div>
  )
}

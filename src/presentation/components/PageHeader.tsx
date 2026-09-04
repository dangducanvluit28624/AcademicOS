import React from 'react'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  actions?: React.ReactNode
  className?: string
  id?: string
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  className = '',
  id,
}: PageHeaderProps) {
  return (
    <div
      id={id}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/80 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {badge && (
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-md">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  )
}

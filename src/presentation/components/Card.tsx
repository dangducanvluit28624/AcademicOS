import React from 'react'

export interface CardProps {
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
  id?: string
}

export function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  id,
}: CardProps) {
  const hasHeader = title || subtitle || icon || action

  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden ${className}`}
    >
      {hasHeader && (
        <div
          className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 ${headerClassName}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-800 tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  )
}

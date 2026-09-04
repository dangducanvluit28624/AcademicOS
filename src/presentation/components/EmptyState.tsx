import React from 'react'
import { FolderOpen } from 'lucide-react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon = <FolderOpen className="w-8 h-8 text-slate-400" />,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-10 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-slate-800 tracking-tight mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

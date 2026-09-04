import React from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

export interface AlertBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  onDismiss?: () => void
  className?: string
  role?: string
}

export function AlertBanner({
  type = 'info',
  title,
  children,
  onDismiss,
  className = '',
  role = type === 'error' || type === 'warning' ? 'alert' : 'status',
}: AlertBannerProps) {
  const styles = {
    info: 'bg-blue-50/90 text-blue-900 border-blue-200/80',
    success: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80',
    warning: 'bg-amber-50/90 text-amber-900 border-amber-200/80',
    error: 'bg-rose-50/90 text-rose-900 border-rose-200/80',
  }[type]

  const icons = {
    info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
    success: (
      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
    ),
    warning: (
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
    ),
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
  }[type]

  return (
    <div
      role={role}
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm shadow-2xs ${styles} ${className}`}
    >
      {icons}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?:
    'default' | 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'purple'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-medium'
      : 'px-2.5 py-1 text-xs font-semibold'

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200',
    purple: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md ${sizeClasses} ${variantClasses} ${className} whitespace-nowrap`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({
  status,
  className = '',
}: {
  status: string
  className?: string
}) {
  const normalized = status.toLowerCase()
  let variant: BadgeProps['variant'] = 'default'

  if (
    normalized === 'active' ||
    normalized === 'completed' ||
    normalized === 'achieved' ||
    normalized === 'available'
  ) {
    variant = 'success'
  } else if (
    normalized === 'planned' ||
    normalized === 'in-progress' ||
    normalized === 'in progress'
  ) {
    variant = 'info'
  } else if (
    normalized === 'archived' ||
    normalized === 'cancelled' ||
    normalized === 'dropped' ||
    normalized === 'not started'
  ) {
    variant = 'neutral'
  } else if (
    normalized === 'deferred' ||
    normalized === 'incomplete' ||
    normalized === 'medium'
  ) {
    variant = 'warning'
  } else if (
    normalized === 'data integrity issue' ||
    normalized === 'unavailable' ||
    normalized === 'failed' ||
    normalized === 'high'
  ) {
    variant = 'danger'
  }

  return (
    <Badge variant={variant} className={className}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success'
            ? 'bg-emerald-500'
            : variant === 'info'
              ? 'bg-blue-500'
              : variant === 'warning'
                ? 'bg-amber-500'
                : variant === 'danger'
                  ? 'bg-rose-500'
                  : 'bg-slate-400'
        }`}
      />
      <span>{status}</span>
    </Badge>
  )
}

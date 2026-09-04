import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'primary',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size]

  const fillColors = {
    primary: 'bg-indigo-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  }[variant]

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs text-slate-600">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercentage && (
            <span className="font-mono text-slate-500">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${fillColors}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

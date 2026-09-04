import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  }[size]

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium shadow-xs border border-indigo-700/50',
    secondary:
      'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium border border-slate-300/80 shadow-2xs',
    outline:
      'bg-transparent hover:bg-slate-100 text-slate-700 font-medium border border-slate-300',
    danger:
      'bg-rose-50 hover:bg-rose-600 hover:text-white active:bg-rose-700 text-rose-700 font-medium border border-rose-200 shadow-2xs transition-colors',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs border border-emerald-700/50',
  }[variant]

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon && !loading && <span className="shrink-0">{icon}</span>}
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  )
}

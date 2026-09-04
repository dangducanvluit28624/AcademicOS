import React, { useId } from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
  containerClassName?: string
}

export function Select({
  label,
  helperText,
  error,
  id,
  children,
  className = '',
  containerClassName = '',
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id || (label ? generatedId : undefined)

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 tracking-tight"
        >
          {label}
          {props.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2 text-sm text-slate-800 bg-white rounded-lg border ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
        } shadow-2xs focus:outline-none focus:ring-2 transition-all duration-150 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-rose-600 font-medium mt-1" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  )
}

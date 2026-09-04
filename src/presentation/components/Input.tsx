import React, { useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  containerClassName?: string
}

export function Input({
  label,
  helperText,
  error,
  id,
  className = '',
  containerClassName = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id || (label ? generatedId : undefined)

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 tracking-tight"
        >
          {label}
          {props.required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 text-sm text-slate-800 bg-white rounded-lg border ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
        } shadow-2xs placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
        {...props}
      />
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

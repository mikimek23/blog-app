//import React, { useState } from 'react'
import {
  ArrowRight,
  Loader2,
  Mail,
  Trash2,
  Plus,
  Download,
  Settings,
  CheckCircle2,
} from 'lucide-react'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = '',
  disabled = false,
  ...props
}) => {
  // Base styles for the button
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl'

  // Style variations
  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30',
    secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    outline:
      'border-2 border-indigo-200 bg-transparent text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-indigo-50',
    destructive:
      'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-500/20',
    gradient:
      'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-90 hover:shadow-lg hover:shadow-fuchsia-500/30',
    glass:
      'bg-white/10 backdrop-blur-md border border-white/30 text-indigo-950 hover:bg-white/20',
  }

  // Size variations
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-8 py-3.5 text-lg gap-3',
    full: 'w-full py-3 text-base gap-2',
    icon: 'h-10 w-10',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      type='submit'
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className='w-4 h-4 animate-spin' />
      ) : (
        <>
          {IconLeft && (
            <IconLeft className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} `} />
          )}
          {children}
          {IconRight && (
            <IconRight className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
          )}
        </>
      )}
    </button>
  )
}

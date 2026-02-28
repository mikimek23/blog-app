import { Loader2 } from 'lucide-react'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'ui-ring-focus inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl border'

  const variants = {
    primary:
      'border-transparent bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] hover:shadow-lg',
    secondary:
      'border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]',
    outline:
      'border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]',
    ghost:
      'border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]',
    destructive:
      'border-transparent bg-[var(--color-danger-soft)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white',
    gradient:
      'border-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white hover:opacity-90 hover:shadow-lg',
    glass:
      'border-[var(--color-border)] bg-[var(--backdrop-glass)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)]',
    blank:
      'border-transparent bg-[var(--color-text-primary)] text-[var(--color-surface)] hover:opacity-90 hover:shadow-lg',
  }

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
      type={type}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className='w-4 h-4 animate-spin' />
      ) : (
        <>
          {IconLeft && (
            <IconLeft className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          )}
          {children}
          {IconRight && (
            <IconRight className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          )}
        </>
      )}
    </button>
  )
}

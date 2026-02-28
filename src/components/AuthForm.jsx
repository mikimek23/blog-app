import { ArrowRight, Eye, EyeOff, LogIn, UserPlus2Icon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './Button.jsx'
import { useNavigate } from 'react-router-dom'

export const AuthForm = ({
  formData,
  islogin,
  onChange,
  handleSubmit,
  message,
  setMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const messageText = message?.[0]

  useEffect(() => {
    if (!messageText) return
    const timer = setTimeout(() => {
      setMessage([null, null])
    }, 2000)
    return () => clearTimeout(timer)
  }, [messageText, setMessage])

  return (
    <div className='w-full max-w-md rounded-3xl overflow-hidden transition-all duration-500 ui-surface'>
      <div className='m-1 justify-items-end' title='Cancel'>
        <button
          type='button'
          onClick={() => navigate('/')}
          className='ui-ring-focus p-2 block hover:bg-[var(--color-surface-soft)] rounded-full transition-colors'
        >
          <X size={24} className='ui-text-muted font-bold' />
        </button>
      </div>
      <div className='px-8 pt-8 pb-6 text-center'>
        <div className='w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg bg-[var(--color-accent)]'>
          {islogin ? (
            <LogIn className='text-white' size={24} />
          ) : (
            <UserPlus2Icon className='text-white' size={24} />
          )}
        </div>
        <h2 className='text-2xl font-bold ui-heading'>
          {islogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className='ui-text-muted mt-1'>
          {islogin
            ? 'Enter your details to access your account'
            : 'Join us and start your journey today'}
        </p>
      </div>
      <div
        className={`relative font-bold text-center p-3 mx-2 rounded-lg border ${
          messageText
            ? message[1]
              ? 'block ui-alert-success'
              : 'block ui-alert-error'
            : 'hidden'
        }`}
      >
        <div className='border-r-2 w-10 h-12 absolute bottom-0 left-0 rounded-lg rounded-r-none border-[var(--color-border)]'></div>
        <span className='pl-4'>{messageText || null}</span>
      </div>
      <form onSubmit={handleSubmit} className='px-8 space-y-4'>
        {formData.map((field) => (
          <div key={field.name} className='space-y-1.5 w-full'>
            <label
              htmlFor={field.name}
              className='text-sm font-semibold ui-text ml-1'
            >
              {field.label}
            </label>
            <div className='relative group'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 ui-text-muted group-focus-within:text-[var(--color-accent)] transition-colors'>
                {field.icon && <field.icon size={18} />}
              </div>
              <input
                type={
                  field.type === 'password'
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : field.type
                }
                placeholder={field.placeholder}
                value={field.value}
                name={field.name}
                id={field.name}
                onChange={onChange}
                className='ui-input pl-10 pr-10 py-3'
                required
              />
              {field.type === 'password' && (
                <button
                  type='button'
                  onClick={() => setShowPassword((value) => !value)}
                  className='ui-ring-focus absolute right-3 top-1/2 -translate-y-1/2 ui-text-muted hover:text-[var(--color-accent)]'
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {islogin && (
          <div className='flex justify-end'>
            <button
              type='button'
              className='ui-ring-focus text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]'
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          variant='primary'
          size='full'
          iconRight={islogin ? ArrowRight : null}
          className='mt-2 cursor-pointer'
          type='submit'
        >
          {islogin ? 'Log In' : 'Create Account'}
        </Button>
      </form>

      <div className='px-8 py-6 border-t ui-border text-center mt-6 bg-[var(--color-surface-soft)]'>
        <p className='text-sm ui-text-muted'>
          {islogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type='button'
            className='ui-ring-focus font-bold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] cursor-pointer'
            onClick={() => (islogin ? navigate('/signup') : navigate('/login'))}
          >
            {islogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}

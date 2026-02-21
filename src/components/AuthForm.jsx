import {
  ArrowLeft,
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Lock,
  LogIn,
  UserPlus2Icon,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'

export const AuthForm = ({
  formData,
  islogin,
  onChange,
  handleSubmit,
  message,
  setMessage,
}) => {
  //const [isLoa
  // ding, setIsLoading] = useState(false)
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
    <div className='w-full max-w-md bg-white/80 rounded-3xl shadow-2xl shadow-indigo-900/25 border border-indigo-100/80 overflow-hidden backdrop-blur-sm transition-all duration-500'>
      <div className='m-1 justify-items-end' title='Cancel'>
        <button
          onClick={() => navigate('/')}
          className='p-2 block  hover:bg-gray-400 rounded-full transition-colors'
        >
          <X size={24} className='text-black/60 font-bold' />
        </button>
      </div>
      {/* Header section with dynamic title */}
      <div className='px-8 pt-8 pb-6 text-center'>
        <div className='w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-300/50'>
          {islogin ? (
            <LogIn className='text-white' size={24} />
          ) : (
            <UserPlus2Icon className='text-white' size={24} />
          )}
        </div>
        <h2 className='text-2xl font-bold text-slate-900'>
          {islogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className='text-slate-600 mt-1'>
          {islogin
            ? 'Enter your details to access your account'
            : ' Join us and start your journey today'}
        </p>
      </div>
      <div
        className={`relative font-bold text-center p-3 mx-2 rounded-lg ${messageText ? (message[1] ? 'block text-green-800 bg-green-400/20' : 'block text-red-500 bg-red-500/20 ') : 'hidden'}`}
      >
        <div
          className={`border-r-2 w-10 h-12 absolute bottom-0 left-0 rounded-lg rounded-r-none border-white/35 `}
        ></div>
        <span className='pl-4'>{messageText ? messageText : null}</span>
      </div>
      <form onSubmit={handleSubmit} className='px-8 space-y-4'>
        {formData.map((field) => (
          <div key={field.name} className='space-y-1.5 w-full'>
            <label
              htmlFor={field.name}
              className='text-sm font-semibold text-slate-700 ml-1'
            >
              {field.label}
            </label>
            <div className='relative group'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors'>
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
                className='w-full pl-10 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                required
              />
              {/* ${error ? 'border-red-200 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-blue-500 focus:bg-white'} */}
              {field.type === 'password' && (
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600'
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            {/* {error && <p className='text-xs text-red-500 ml-1'>{error}</p>} */}
          </div>
        ))}

        {islogin && (
          <div className='flex justify-end'>
            <button
              type='button'
              className='text-sm font-medium text-indigo-600 hover:text-violet-600'
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          variant='primary'
          //isLoading={true}
          size='full'
          iconRight={islogin ? ArrowRight : null}
          className='mt-2 cursor-pointer'
        >
          {islogin ? 'Log In' : 'Create Account'}
        </Button>
      </form>

      {/* Divider */}
      <div className='px-8 py-6'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-indigo-100'></div>
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-white px-2 text-slate-400 font-medium'></span>
          </div>
        </div>
      </div>

      {/* Footer toggle link */}
      <div className='px-8 py-6 bg-gradient-to-r from-indigo-50 to-violet-50 border-t border-indigo-100 text-center'>
        <p className='text-sm text-slate-600'>
          {islogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className='font-bold text-indigo-600 transition-colors hover:text-violet-500 cursor-pointer'
            onClick={() => (islogin ? navigate('/signup') : navigate('/login'))}
          >
            {islogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}

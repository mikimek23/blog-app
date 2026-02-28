import { Lock, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../Button.jsx'
import { useMutation } from '@tanstack/react-query'
import { userLogin } from '../../api/auth.js'
import { useNavigate } from 'react-router-dom'

export const Adminlogin = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState([null, null])
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const loginMutation = useMutation({
    mutationFn: () => userLogin(data),
    onSuccess: (session) => {
      if (session?.user?.role !== 'admin') {
        setMessage(['Admins only', false])
        return
      }
      setMessage(['Login successful', true])
      navigate('/admin/dashboard')
    },
    onError: (error) => {
      setMessage([error.response?.data?.message || 'Login failed', false])
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    loginMutation.mutate()
  }

  const messageText = message?.[0]

  useEffect(() => {
    if (!messageText) return
    const timer = setTimeout(() => {
      setMessage([null, null])
    }, 2000)
    return () => clearTimeout(timer)
  }, [messageText])

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 animate-in fade-in zoom-in duration-500'>
        <div className='text-center mb-8'>
          <div className='w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-300'>
            <Lock className='text-white' size={28} />
          </div>
          <h2 className='text-2xl font-bold text-slate-800'>Admin Portal</h2>
          <p className='text-slate-500 mt-1'>Sign in to manage your blog</p>
        </div>
        <div
          className={`relative font-bold text-center p-3 mx-2 rounded-lg ${
            messageText
              ? message[1]
                ? 'block text-green-800 bg-green-400/20'
                : 'block text-red-500 bg-red-500/20'
              : 'hidden'
          }`}
        >
          <div className='border-r-2 w-10 h-12 absolute bottom-0 left-0 rounded-lg rounded-r-none border-white/35'></div>
          <span className='pl-4'>{messageText || null}</span>
        </div>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-1.5 w-full'>
            <label className='text-sm font-semibold text-slate-700 ml-1'>
              Email
            </label>
            <div className='relative group'>
              <div className='absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <Mail size={18} />
              </div>
              <input
                type='email'
                value={data.email}
                name='email'
                onChange={handleChange}
                placeholder='admin@mblog.com'
                className='w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white shadow-sm focus:shadow-blue-100 transition-all text-gray-500 font-bold'
                required
              />
            </div>
          </div>
          <div className='space-y-1.5 w-full'>
            <label className='text-sm font-semibold text-slate-700 ml-1'>
              Password
            </label>
            <div className='relative group'>
              <div className='absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <Lock size={18} />
              </div>
              <input
                type='password'
                value={data.password}
                name='password'
                onChange={handleChange}
                placeholder='********'
                className='w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white shadow-sm focus:shadow-blue-100 transition-all text-gray-500 font-bold'
                required
              />
            </div>
          </div>
          <Button variant='blank' size='full' className='mt-4' type='submit'>
            Access Dashboard
          </Button>
        </form>
      </div>
    </div>
  )
}

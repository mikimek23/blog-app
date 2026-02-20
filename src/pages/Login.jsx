import { ArrowLeft, Lock, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { AuthForm } from '../components/authForm'
import { useMutation } from '@tanstack/react-query'
import { userLogin } from '../api/auth.js'
import { toast } from 'react-toastify'

export const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }
  const FormData = [
    {
      label: 'Email',
      icon: Mail,
      type: 'email',
      value: data.email,
      placeholder: 'example@gmail.com',
      name: 'email',
    },
    {
      label: 'Password',
      icon: Lock,
      type: 'password',
      value: data.password,
      placeholder: '••••••••',
      name: 'password',
    },
  ]
  const loginMutation = useMutation({
    mutationFn: () => userLogin(data),
    onSuccess: (res) => {
      toast(res?.data?.message)
      setData({
        email: '',
        password: '',
      })
    },
    onError: (error) => {
      toast(error.response?.data?.message)
      setData({
        email: '',
        password: '',
      })
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate()
  }
  return (
    <div className='min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6'>
      <div className='fixed top-8 left-8 hidden lg:block'>
        <div className='flex items-center gap-2 text-indigo-200'>
          <div className='w-8 h-8 rounded-full bg-white/10 border border-indigo-200/40 flex items-center justify-center shadow-sm backdrop-blur-sm'>
            <ArrowLeft size={16} />
          </div>
          <span className='text-sm font-medium'>Back to website</span>
        </div>
      </div>
      <AuthForm
        formData={FormData}
        islogin={true}
        onChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

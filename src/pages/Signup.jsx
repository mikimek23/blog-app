import { ArrowLeft, Lock, Mail, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { AuthForm } from '../components/authForm'
import { useMutation } from '@tanstack/react-query'
import { userRegister } from '../api/auth'

export const Signup = () => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }
  const FormData = [
    {
      label: 'Username',
      icon: UserPlus,
      type: 'text',
      value: data.username,
      placeholder: 'username',
      name: 'username',
    },
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
  const signupMutation = useMutation({
    mutationFn: () => userRegister(data),
    onSuccess: () => {
      alert('Your acount is created!')
      setData({
        username: '',
        email: '',
        password: '',
      })
    },
    onError: () => {
      alert('registration fialed!')
      setData({
        username: '',
        email: '',
        password: '',
      })
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    signupMutation.mutate()
  }
  const user = signupMutation?.data ?? {}
  console.log(user)
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
        islogin={false}
        onChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

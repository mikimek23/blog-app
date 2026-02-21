import { Lock, Mail, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import { AuthForm } from '../components/authForm'
import { useMutation } from '@tanstack/react-query'
import { userRegister } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export const Signup = () => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState([null, null])
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
  const navigate = useNavigate()
  const signupMutation = useMutation({
    mutationFn: () => userRegister(data),
    onSuccess: (res) => {
      setMessage([res?.data?.message, true])
      setData({
        username: '',
        email: '',
        password: '',
      })
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    },
    onError: (error) => {
      setMessage([error.response?.data?.message, false])
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
      <AuthForm
        formData={FormData}
        islogin={false}
        onChange={handleChange}
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
      />
    </div>
  )
}

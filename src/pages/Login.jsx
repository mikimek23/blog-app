import { Lock, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { AuthForm } from '../components/authForm'
import { useMutation } from '@tanstack/react-query'
import { userLogin } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState([null, null])
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }
  const navigate = useNavigate()
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
      setMessage([res?.data?.message, true])
      setData({
        email: '',
        password: '',
      })
      setTimeout(() => {
        navigate('/')
      }, 2000)
    },
    onError: (error) => {
      setMessage([error.response?.data?.message, false])
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
      <AuthForm
        formData={FormData}
        islogin={true}
        onChange={handleChange}
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
      />
    </div>
  )
}

import { Lock, Mail, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { AuthForm } from '../components/AuthForm.jsx'
import { useMutation } from '@tanstack/react-query'
import { userRegister } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'

export const Signup = () => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState([null, null])
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const formFields = [
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
      placeholder: '********',
      name: 'password',
    },
  ]

  const signupMutation = useMutation({
    mutationFn: () => userRegister(data),
    onSuccess: () => {
      setMessage(['Registration completed', true])
      setData({ username: '', email: '', password: '' })
      setTimeout(() => {
        navigate('/login')
      }, 500)
    },
    onError: (error) => {
      setMessage([
        error.response?.data?.message || 'Registration failed',
        false,
      ])
      setData({ username: '', email: '', password: '' })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    signupMutation.mutate()
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6'>
      <AuthForm
        formData={formFields}
        islogin={false}
        onChange={handleChange}
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
      />
    </div>
  )
}

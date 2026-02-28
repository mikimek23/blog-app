import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { AuthForm } from '../components/AuthForm.jsx'
import { useMutation } from '@tanstack/react-query'
import { userLogin } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
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

  const formFields = [
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

  const loginMutation = useMutation({
    mutationFn: () => userLogin(data),
    onSuccess: () => {
      setMessage(['You are logged in', true])
      setData({ email: '', password: '' })
      navigate('/')
    },
    onError: (error) => {
      setMessage([error.response?.data?.message || 'Login failed', false])
      setData({ email: '', password: '' })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    loginMutation.mutate()
  }

  return (
    <div className='min-h-screen ui-app-bg flex items-center justify-center p-6'>
      <AuthForm
        formData={formFields}
        islogin
        onChange={handleChange}
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
      />
    </div>
  )
}

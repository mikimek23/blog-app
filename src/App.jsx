//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from './components/Button.jsx'
import { AuthForm } from './components/authForm.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/login.jsx'
import { ToastContainer } from 'react-toastify'
import { Navbar } from './components/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { refreshAccessToken } from './api/auth.js'

function App() {
  const didRefresh = useRef(false)
  useEffect(() => {
    if (didRefresh.current) return
    didRefresh.current = true
    refreshAccessToken().catch(() => {})
  }, [])
  return (
    <div className='space-y-16 animate-in fade-in duration-700'>
      <Navbar />

      <section className='text-center py-12'>
        <h1 className='text-5xl md:text-7xl font-black text-slate-900 leading-tight'>
          Insights for the{' '}
          <span className='text-blue-600 underline decoration-blue-100 underline-offset-8'>
            modern
          </span>{' '}
          dev.
        </h1>
        <p className='mt-6 text-xl text-slate-500 max-w-2xl mx-auto'>
          Discover the latest trends in UI/UX, software architecture, and the
          future of the web.
        </p>
      </section>
      <Outlet />
      <ToastContainer />
    </div>
  )
}

export default App

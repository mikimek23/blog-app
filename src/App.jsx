//import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Button } from './components/Button.jsx'
import { AuthForm } from './components/authForm.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/login.jsx'
import { ToastContainer } from 'react-toastify'
const queryClient = new QueryClient()
function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Login />
        <ToastContainer />
      </QueryClientProvider>
    </div>
  )
}

export default App

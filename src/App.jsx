import { ToastContainer } from 'react-toastify'
import { Navbar } from './components/Navbar.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='space-y-16 animate-in fade-in duration-700'>
      <Navbar />

      <div className='text-center py-12'></div>
      <Outlet />
      <ToastContainer />
    </div>
  )
}

export default App

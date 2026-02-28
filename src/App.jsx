import { ToastContainer } from 'react-toastify'
import { Navbar } from './components/Navbar.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main id='main-content' className='pt-24 pb-16'>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}

export default App

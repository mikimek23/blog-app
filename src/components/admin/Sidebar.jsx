import {
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { userLogOut } from '../../api/auth.js'

export const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate()

  const navClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
      isActive
        ? 'bg-slate-100 text-slate-900'
        : 'hover:bg-slate-800 hover:text-white text-slate-300'
    }`

  const handleLogout = async () => {
    try {
      await userLogOut()
    } finally {
      onNavigate?.()
      navigate('/admin/login')
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800'>
        <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3'>
          <span className='text-white font-black'>M</span>
        </div>
        <span className='text-white font-bold text-lg tracking-wide'>
          M Blog Admin
        </span>
        <button
          type='button'
          className='ml-auto md:hidden text-slate-400'
          onClick={() => onNavigate?.()}
        >
          <X size={20} />
        </button>
      </div>

      <div className='flex-1 py-6 px-4 space-y-2'>
        <NavLink
          to='/admin/dashboard'
          className={navClass}
          onClick={() => onNavigate?.()}
        >
          <LayoutDashboard size={20} />
          <span className='font-medium'>Dashboard</span>
        </NavLink>
        <NavLink
          to='/admin/posts'
          className={navClass}
          onClick={() => onNavigate?.()}
        >
          <FileText size={20} />
          <span className='font-medium'>Posts Manager</span>
        </NavLink>
        <NavLink
          to='/admin/users'
          className={navClass}
          onClick={() => onNavigate?.()}
        >
          <UsersRound size={20} />
          <span className='font-medium'>Users</span>
        </NavLink>
        <NavLink
          to='/admin/moderation'
          className={navClass}
          onClick={() => onNavigate?.()}
        >
          <ShieldCheck size={20} />
          <span className='font-medium'>Moderation</span>
        </NavLink>
      </div>

      <div className='p-4 border-t border-slate-800'>
        <button
          type='button'
          onClick={handleLogout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors'
        >
          <LogOut size={20} />
          <span className='font-medium'>Log out</span>
        </button>
      </div>
    </div>
  )
}

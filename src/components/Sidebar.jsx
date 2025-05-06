// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  IconMenu2,
  IconHome,
  IconBulb,
  IconChartBar,
  IconSettings,
  IconUserCircle,
  IconLogout,
} from '@tabler/icons-react'
import { useLogout } from '../hooks/useAuth'

export default function Sidebar({ isOpen, toggle }) {
  const [firstName, setFirstName] = useState('User')
  const navigate = useNavigate()
  const { mutate: logout, isLoading: logoutLoading } = useLogout()

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'))
      if (u?.first_name) setFirstName(u.first_name)
    } catch {}
  }, [])

  const initial = firstName.charAt(0).toUpperCase()
  const linkPadding = isOpen ? 'px-4' : 'px-3'

  const handleSignOut = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/', { replace: true })
      },
    })
  }

  return (
    <div className={`
      flex flex-col justify-between
      bg-white shadow-lg
      transition-all duration-300
      ${isOpen ? 'w-64' : 'w-20'}
    `}>
      <div>
        <button
          onClick={toggle}
          className="p-4 focus:outline-none"
        >
          <IconMenu2 size={24} />
        </button>

        {isOpen && (
          <div className="px-4 mb-8">
            <h1 className="text-2xl font-bold">ThinkWise AI</h1>
          </div>
        )}

        <nav className="space-y-2">
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `flex items-center py-2 rounded transition-colors hover:bg-gray-100 ${linkPadding}
               ${isActive ? 'bg-primary-50 text-primary-600' : ''}`
            }
          >
            <IconHome size={20} />
            {isOpen && <span className="ml-3">Home</span>}
          </NavLink>

          <NavLink
            to="/app/ideas"
            className={({ isActive }) =>
              `flex items-center py-2 rounded transition-colors hover:bg-gray-100 ${linkPadding}
               ${isActive ? 'bg-primary-50 text-primary-600' : ''}`
            }
          >
            <IconBulb size={20} />
            {isOpen && <span className="ml-3">Idea Store</span>}
          </NavLink>

          <NavLink
            to="/app/analytics"
            className={({ isActive }) =>
              `flex items-center py-2 rounded transition-colors hover:bg-gray-100 ${linkPadding}
               ${isActive ? 'bg-primary-50 text-primary-600' : ''}`
            }
          >
            <IconChartBar size={20} />
            {isOpen && <span className="ml-3">Analytics</span>}
          </NavLink>
          <NavLink
  to="/about"
  className={({ isActive }) =>
    `flex items-center py-2 rounded transition-colors hover:bg-gray-100 ${
      isActive ? 'bg-primary-50 text-primary-600' : ''
    } ${linkPadding}`
  }
>
  <IconUserCircle size={20} />
  {isOpen && <span className="ml-3">About Us</span>}
</NavLink>

          <NavLink
  to="/app/settings"
  className={({ isActive }) =>
    `flex items-center py-2 rounded transition-colors hover:bg-gray-100 ${
      isActive ? 'bg-gray-200 text-blue-600' : ''
    } ${linkPadding}`
  }
>
  <IconSettings size={20} />
  {isOpen && <span className="ml-3">Settings</span>}
</NavLink>
        </nav>
      </div>

      {/* Bottom User & Sign Out */}
      <div className="p-4 space-y-2">
        <div className="flex items-center">
          <div className={`
            flex items-center justify-center
            w-10 h-10 rounded-full
            bg-primary-600 text-white
            text-lg font-medium
          `}>
            {initial}
          </div>
          {isOpen && (
            <span className="ml-3 text-gray-800">{firstName}</span>
          )}
        </div>

        <button
          onClick={handleSignOut}
          disabled={logoutLoading}
          className={`
            flex items-center w-full mt-2 py-2 rounded transition-colors
            ${logoutLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
          `}
        >
          <IconLogout size={18} className="mr-2" />
          {isOpen && (logoutLoading ? 'Signing out…' : 'Sign Out')}
        </button>
      </div>
    </div>
  )
}

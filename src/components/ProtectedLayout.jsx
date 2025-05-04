// src/components/ProtectedLayout.jsx
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLogout } from '../hooks/useAuth'

export default function ProtectedLayout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen(o => !o)
  const navigate = useNavigate()

  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // custom cleanup
        onLogout()
        // go back to login
        navigate('/', { replace: true })
      },
    })
  }

  return (
    <div className="flex h-screen font-sans">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      <main className="flex-1 overflow-auto bg-gradient-to-br from-primary-100 to-primary-300 rounded-tl-3xl rounded-bl-3xl relative">

        <Outlet context={{ toggleSidebar }} />
      </main>
    </div>
  )
}

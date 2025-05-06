import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useCurrentUser, useLogout } from '../hooks/useAuth';

export default function ProtectedLayout({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(o => !o);

  const { data: user, isLoading } = useCurrentUser();  // use isLoading

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        onLogout();
      },
    });
  };

  // Wait for loading, then redirect if not logged in
  if (isLoading) return <div className="p-8">Loading your workspace...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="flex h-screen font-sans">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      <main className="flex-1 overflow-auto bg-gradient-to-br from-primary-100 to-primary-300 rounded-tl-3xl rounded-bl-3xl relative">
        <Outlet context={{ toggleSidebar }} />
      </main>
    </div>
  );
}

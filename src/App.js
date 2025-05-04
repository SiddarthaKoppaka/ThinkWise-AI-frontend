// src/App.js
import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import LandingPage      from './components/LandingPage'
import AuthPage         from './components/AuthPage'
import ProtectedLayout  from './components/ProtectedLayout'
import MainPage         from './components/MainPage'
import AnalyticsPage    from './components/AnalyticsPage'
import AllIdeasPage from './components/AllIdeasPage'
import TopIdeasPage from './components/TopIdeasPage'
import IdeaChat         from './components/IdeaChat'
import AboutUs from './components/AboutUs';
import ResetPasswordPage from './components/ResetPasswordPage'
import SettingsPage     from './components/SettingsPage'
import './App.css'
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      {/* 1. Landing */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* 2. Auth */}
      <Route
        path="/auth"
        element={<AuthPage onAuth={() => setIsAuthenticated(true)} />}
      />

      {/* 3. Protected App Shell */}
      <Route
        path="/app/*"
        element={
          isAuthenticated
            ? <ProtectedLayout onLogout={() => setIsAuthenticated(false)} />
            : <Navigate to="/auth" replace />
        }
      >
        <Route index element={<MainPage />} />
        
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="ideas" element={<AllIdeasPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="ideas/top" element={<TopIdeasPage />} />


{/* single‐idea chat */}
<Route path="ideas/:ideaId" element={<IdeaChat />} />
      </Route>
      <Route path="/about" element={<AboutUs />} />
      {/* 4. Fallback to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

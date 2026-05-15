import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  const { theme, isDark } = useTheme()

  return (
    <div className={`flex h-screen overflow-hidden ${theme.bg} transition-colors duration-300`}>
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden ${theme.bg} transition-colors duration-300`}>
        <TopBar />
        <main className={`flex-1 overflow-y-auto p-6 ${theme.bg} transition-colors duration-300`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

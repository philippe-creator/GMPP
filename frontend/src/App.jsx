import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MachinesPage from './pages/MachinesPage'
import MaintenancePointsPage from './pages/MaintenancePointsPage'
import InterventionsPage from './pages/InterventionsPage'
import PlanningPage from './pages/PlanningPage'
import UsersPage from './pages/UsersPage'
import ConsumablesPage from './pages/ConsumablesPage'
import ReportsPage from './pages/ReportsPage'
import MobileScanPage from './pages/MobileScanPage'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const { isDark } = useTheme()
  if (loading) return <div className={`min-h-screen ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'} flex items-center justify-center`}><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"/></div>
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const { isDark } = useTheme()
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/scan" element={<PrivateRoute><MobileScanPage /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="machines" element={<MachinesPage />} />
            <Route path="maintenance-points" element={<MaintenancePointsPage />} />
            <Route path="interventions" element={<InterventionsPage />} />
            <Route path="planning" element={<PlanningPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="consumables" element={<ConsumablesPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" theme={isDark ? 'dark' : 'light'} autoClose={3000} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import {
  LayoutDashboard, Cpu, Wrench, ClipboardList, Calendar,
  Users, Package, BarChart3, LogOut, Settings, Zap
} from 'lucide-react'

const allLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/machines', icon: Cpu, label: 'Machines', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/maintenance-points', icon: Wrench, label: 'Points de maintenance', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/interventions', icon: ClipboardList, label: 'Interventions', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/planning', icon: Calendar, label: 'Planning', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/users', icon: Users, label: 'Utilisateurs', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE'] },
  { to: '/consumables', icon: Package, label: 'Consommables', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE', 'CHEF_EQUIPE', 'TECHNICIEN'] },
  { to: '/reports', icon: BarChart3, label: 'Rapports', roles: ['ADMIN', 'RESPONSABLE_MAINTENANCE'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, isDark } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const filteredLinks = allLinks.filter(link => link.roles.includes(user?.role))

  return (
    <aside className={`w-64 ${theme.sidebar} border-r ${theme.border} flex flex-col h-screen sticky top-0 transition-colors duration-300`}>
      {/* Logo */}
      <div className={`p-6 border-b ${theme.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${theme.accent} rounded-lg flex items-center justify-center`}>
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className={`font-bold ${theme.text} text-lg leading-none`}>GMPP</h1>
            <p className={`${theme.textMuted} text-xs mt-0.5`}>Maintenance ERP</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? `${isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-600 border border-amber-200'}`
                  : `${theme.textMuted} hover:${theme.text} ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}`
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={`p-4 border-t ${theme.border}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'} rounded-full flex items-center justify-center ${theme.accentText} font-bold text-sm`}>
            {user?.fullName?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${theme.text} text-sm font-medium truncate`}>{user?.fullName}</p>
            <p className={`${theme.textMuted} text-xs truncate`}>{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={handleLogout} className={`${theme.buttonSecondary} w-full justify-start text-xs flex items-center gap-2 px-3 py-2 rounded-lg transition-colors`}>
          <LogOut size={14} /> Déconnexion
        </button>
      </div>
    </aside>
  )
}

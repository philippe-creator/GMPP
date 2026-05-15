import React, { useState, useEffect } from 'react'
import { Bell, Search, Sun, Moon } from 'lucide-react'
import { notificationsApi } from '../../api/services'
import { useTheme } from '../../contexts/ThemeContext'

export default function TopBar() {
  const [unread, setUnread] = useState(0)
  const { isDark, toggleTheme, theme } = useTheme()

  useEffect(() => {
    notificationsApi.getUnreadCount()
      .then(r => setUnread(r.data.count))
      .catch(() => {})
    const interval = setInterval(() => {
      notificationsApi.getUnreadCount().then(r => setUnread(r.data.count)).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className={`h-16 ${theme.topbar} border-b ${theme.border} flex items-center justify-between px-6 shrink-0 transition-colors duration-300`}>
      <div className={`flex items-center gap-2 ${isDark ? 'bg-slate-900' : 'bg-slate-100'} border ${theme.border} rounded-lg px-3 py-1.5 w-72 transition-colors duration-300`}>
        <Search size={15} className={theme.textMuted} />
        <input className={`bg-transparent text-sm ${theme.textSecondary} placeholder-slate-500 outline-none w-full`} placeholder="Rechercher…" />
      </div>
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-all duration-300 group`}
          title={isDark ? 'Mode clair' : 'Mode sombre'}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <Moon size={18} className="text-slate-600 group-hover:rotate-12 transition-transform duration-500" />
          )}
        </button>
        
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell size={20} className={`${theme.textMuted} hover:${theme.text} transition-colors`} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

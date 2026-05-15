import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function StatCard({ label, value, icon: Icon, color = 'amber', sub }) {
  const { theme, isDark } = useTheme()

  const colors = {
    amber: isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600',
    green: isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
    red: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600',
    blue: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600',
    purple: isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600',
  }

  return (
    <div className={`${theme.bgCard} ${theme.border} border rounded-none p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 group`}>
      <div className={`w-12 h-12 rounded-none flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} />
      </div>
      <div>
        <p className={`text-2xl font-light ${theme.text} tracking-tight`}>{value ?? '—'}</p>
        <p className={`${theme.textMuted} text-sm font-light`}>{label}</p>
        {sub && <p className={`text-xs ${theme.textSubtle} mt-0.5 font-light`}>{sub}</p>}
      </div>
    </div>
  )
}

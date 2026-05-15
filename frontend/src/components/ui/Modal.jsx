import React from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const { theme, isDark } = useTheme()

  if (!open) return null
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-slate-900/40'} backdrop-blur-sm`} onClick={onClose} />
      <div className={`relative ${theme.bgCard} ${theme.border} border rounded-none w-full ${widths[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
          <h2 className={`text-lg font-light ${theme.text}`}>{title}</h2>
          <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text} transition-colors`}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

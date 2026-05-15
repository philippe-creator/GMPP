import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('gmpp-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('gmpp-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  const theme = isDark ? {
    isDark: true,
    bg: 'bg-[#0f172a]',
    bgSecondary: 'bg-[#1e293b]',
    bgCard: 'bg-slate-800',
    text: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    border: 'border-slate-700',
    accent: 'bg-amber-500',
    accentText: 'text-amber-500',
    sidebar: 'bg-[#1e293b]',
    topbar: 'bg-[#1e293b]',
    hover: 'hover:bg-slate-700',
    input: 'bg-slate-900 border-slate-700 text-slate-200',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    buttonSecondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  } : {
    isDark: false,
    bg: 'bg-slate-50',
    bgSecondary: 'bg-white',
    bgCard: 'bg-white',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    border: 'border-slate-200',
    accent: 'bg-amber-500',
    accentText: 'text-amber-600',
    sidebar: 'bg-white',
    topbar: 'bg-white',
    hover: 'hover:bg-slate-100',
    input: 'bg-white border-slate-300 text-slate-900',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    buttonSecondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
    danger: 'bg-red-50 text-red-600 border-red-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    info: 'bg-blue-50 text-blue-600 border-blue-200',
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

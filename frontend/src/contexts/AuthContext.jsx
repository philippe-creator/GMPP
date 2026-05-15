import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('gmpp_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('gmpp_user')
      if (stored) { try { setUser(JSON.parse(stored)) } catch {} }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser({ id: data.id, fullName: data.fullName, email: data.email, role: data.role })
    localStorage.setItem('gmpp_token', data.token)
    localStorage.setItem('gmpp_user', JSON.stringify({ id: data.id, fullName: data.fullName, email: data.email, role: data.role }))
    return data
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('gmpp_token'); localStorage.removeItem('gmpp_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

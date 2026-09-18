import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, if a token exists, treat the user as logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Decode user_id from the JWT payload (base64 middle segment)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.user_id })
      } catch {
        localStorage.removeItem('access_token')
      }
    }
    setLoading(false)
  }, [])

  async function login(username, password) {
    const { data } = await client.post('/api/token/', { username, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const payload = JSON.parse(atob(data.access.split('.')[1]))
    setUser({ id: payload.user_id, username })
    return data
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
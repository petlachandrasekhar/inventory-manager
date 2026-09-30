import { useEffect, useState } from 'react'

import { AuthContext } from './authContext'
import api from '../services/api'

const TOKEN_KEY = 'inventory_token'
const USER_KEY = 'inventory_user'

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) return undefined

    let active = true

    api.get('/auth/me')
      .then(({ data }) => {
        if (active) {
          setUser(data.user)
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        }
      })
      .catch(() => {
        if (active) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [token])

  const saveSession = (session) => {
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
    setToken(session.token)
    setUser(session.user)
  }

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    saveSession(data)
    return data.user
  }

  const register = async (details) => {
    const { data } = await api.post('/auth/register', details)
    saveSession(data)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
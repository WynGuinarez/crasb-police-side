import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'officer'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // In a real app, validate token with backend
          const userData = localStorage.getItem('user_data')
          if (userData) {
            setUser(JSON.parse(userData))
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Mock authentication - replace with real API call
      if (username === 'admin' && password === 'admin123') {
        const userData: User = {
          id: '1',
          username: 'admin',
          email: 'admin@crash.gov',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        }
        
        const token = 'mock_token_' + Date.now()
        
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(userData))
        setUser(userData)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

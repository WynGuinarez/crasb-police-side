import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
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
        // Clear invalid auth data on error
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Authentication Login
   * ============================================================================
   * 
   * BACKEND ENDPOINT: POST /api/auth/login/
   * 
   * REQUEST BODY:
   * {
   *   "username": "string",
   *   "password": "string"
   * }
   * 
   * EXPECTED RESPONSE (Success - 200):
   * {
   *   "token": "jwt_token_string",
   *   "user": {
   *     "id": "uuid",
   *     "username": "string",
   *     "email": "string",
   *     "firstName": "string",
   *     "lastName": "string",
   *     "role": "admin" | "police",
   *     "office_id": "uuid" (optional, if user belongs to an office)
   *   }
   * }
   * 
   * ERROR RESPONSE (401):
   * {
   *   "error": "Invalid credentials"
   * }
   * 
   * INTEGRATION STEPS:
   * 1. Replace the mock authentication with a fetch/axios call to POST /api/auth/login/
   * 2. Send username and password in the request body
   * 3. On success, store the token in localStorage as 'auth_token'
   * 4. Store the user object in localStorage as 'user_data'
   * 5. Set the user state with the response user data
   * 6. Return true on success, false on error
   * 7. Handle 401 errors by returning false (will show error message in UI)
   * 
   * EXAMPLE IMPLEMENTATION:
   * const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ username, password })
   * })
   * 
   * if (response.ok) {
   *   const data = await response.json()
   *   localStorage.setItem('auth_token', data.token)
   *   localStorage.setItem('user_data', JSON.stringify(data.user))
   *   setUser(data.user)
   *   return true
   * } else {
   *   return false
   * }
   * ============================================================================
   */
  const login = async (username, password) => {
    try {
      setLoading(true)
      
      // TODO: REPLACE MOCK AUTHENTICATION WITH BACKEND API CALL
      // BACKEND ENDPOINT: POST /api/auth/login/
      // See detailed comments above for integration guide
      
      // Mock authentication - replace with real API call
      if (username === 'admin' && password === 'admin123') {
        const userData = {
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
      // Login failed - return false to show error message
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

  const value = {
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


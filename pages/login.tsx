import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const router = useRouter()
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({})

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}
    
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setErrors({})
    
    try {
      const success = await login(username.trim(), password)
      
      if (success) {
        toast.success('Login successful!')
        router.push('/dashboard')
      } else {
        setErrors({ general: 'Invalid credentials. Please check your username and password.' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center glass-bg-static">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center glass-bg-static py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl ring-2 ring-white/50">
            <span className="text-primary-600 text-2xl font-bold">C</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white drop-shadow-md">
            CRASH Dashboard
          </h2>
          <p className="mt-2 text-sm text-white/95 font-medium">
            Police Authority Login
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="glass-card-strong p-8 space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-danger-500" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-danger-500">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-danger-500" />
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger-500">{errors.password}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg p-3 shadow-sm">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm font-medium text-red-600">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
              <p className="text-sm text-gray-700">
                <strong className="font-semibold">Username:</strong> admin<br />
                <strong className="font-semibold">Password:</strong> admin123
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

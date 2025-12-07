import { Bell, LogOut } from 'lucide-react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const PageHeader = ({ onLogout }) => {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logout()
      toast.success('Logged out successfully')
      router.push('/login')
    }
  }

  return (
    <header className="bg-gradient-primary/95 backdrop-blur-md shadow-lg border-b border-white/30 fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-xl ring-2 ring-white/50 hover:scale-105 transition-transform">
              <span className="text-primary-600 text-lg font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-md">CRASH Dashboard</h1>
              <p className="text-xs text-white/70">Police Emergency Response System</p>
            </div>
          </div>
          
          {/* Center Section - Empty for Balance */}
          
          {/* Right Section - Actions & User Menu */}
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-white/90">System Active</span>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all relative group">
                <Bell className="h-5 w-5" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Notifications</span>
              </button>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-3 pl-6 border-l border-white/20">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-white/70">{user?.role}</p>
              </div>
              <div className="h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all cursor-pointer">
                <span className="text-white font-bold text-sm">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-white/80 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default PageHeader


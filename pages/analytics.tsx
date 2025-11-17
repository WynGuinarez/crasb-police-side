import {
    BarChart3,
    Bell,
    Calendar,
    Download,
    Filter,
    Home,
    LogOut,
    Map,
    MapPin,
    TrendingUp
} from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ResolvedCaseDetailsModal from '../components/ResolvedCaseDetailsModal'
import { useAuth } from '../contexts/AuthContext'

interface AnalyticsData {
  topLocations: {
    city: string
    barangay: string
    count: number
    percentage: number
  }[]
  resolvedCases: {
    id: string
    reporterName: string
    reporterPhone: string
    reporterEmail: string
    category: string
    city: string
    barangay: string
    location: {
      address: string
      lat: number
      lng: number
    }
    description: string
    dateReported: string
    dateResolved: string
    resolutionTime: string
    finalStatus: string
    resolutionNotes?: string
  }[]
  categoryStats: {
    category: string
    count: number
    percentage: number
  }[]
  timeStats: {
    period: string
    count: number
  }[]
}

const Analytics = () => {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('analytics')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [analyticsView, setAnalyticsView] = useState<'locations' | 'resolved'>('locations')
  const [showResolvedCaseModal, setShowResolvedCaseModal] = useState(false)
  const [selectedResolvedCase, setSelectedResolvedCase] = useState<AnalyticsData['resolvedCases'][0] | null>(null)

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockData: AnalyticsData = {
      topLocations: [
        { city: 'Manila', barangay: 'Malate', count: 45, percentage: 25.5 },
        { city: 'Quezon City', barangay: 'Diliman', count: 38, percentage: 21.6 },
        { city: 'Makati', barangay: 'Ayala', count: 32, percentage: 18.2 },
        { city: 'Manila', barangay: 'Ermita', count: 28, percentage: 15.9 },
        { city: 'Quezon City', barangay: 'Cubao', count: 22, percentage: 12.5 },
        { city: 'Makati', barangay: 'Salcedo', count: 11, percentage: 6.3 }
      ],
      resolvedCases: [
        {
          id: '1',
          reporterName: 'Wyn Guinarez',
          reporterPhone: '+63 912 345 6789',
          reporterEmail: 'wyne@email.com',
          category: 'Crime',
          city: 'Manila',
          barangay: 'Malate',
          location: {
            address: 'Rizal Park, Malate, Manila',
            lat: 14.5995,
            lng: 120.9842
          },
          description: 'Suspicious activity near the park. Two individuals acting suspiciously around parked vehicles.',
          dateReported: '2024-01-15T12:15:00Z',
          dateResolved: '2024-01-15T14:30:00Z',
          resolutionTime: '2h 15m',
          finalStatus: 'Resolved',
          resolutionNotes: 'Suspects were questioned and released. Increased patrols in the area.'
        },
        {
          id: '2',
          reporterName: 'Rodel Lingcopines',
          reporterPhone: '+63 917 123 4567',
          reporterEmail: 'Lingcopines@email.com',
          category: 'Fire',
          city: 'Quezon City',
          barangay: 'Diliman',
          location: {
            address: '123 University Ave, Diliman, Quezon City',
            lat: 14.6539,
            lng: 121.0689
          },
          description: 'Fire alarm triggered in residential building. Smoke visible from 3rd floor.',
          dateReported: '2024-01-15T10:15:00Z',
          dateResolved: '2024-01-15T11:45:00Z',
          resolutionTime: '1h 30m',
          finalStatus: 'Resolved',
          resolutionNotes: 'False alarm caused by cooking smoke. Building cleared and residents notified.'
        },
        {
          id: '3',
          reporterName: 'Abram Luke Mora',
          reporterPhone: '+63 918 765 4321',
          reporterEmail: 'ambram.mora@email.com',
          category: 'Medical',
          city: 'Makati',
          barangay: 'Ayala',
          location: {
            address: 'Ayala Avenue, Makati City',
            lat: 14.5547,
            lng: 121.0244
          },
          description: 'Medical emergency at office building. Person collapsed and needs immediate medical attention.',
          dateReported: '2024-01-15T08:45:00Z',
          dateResolved: '2024-01-15T09:20:00Z',
          resolutionTime: '35m',
          finalStatus: 'Resolved',
          resolutionNotes: 'Patient was transported to hospital. Condition stable. Family notified.'
        },
        {
          id: '4',
          reporterName: 'John Krystianne David',
          reporterPhone: '+63 919 888 7777',
          reporterEmail: 'Jk.David@email.com',
          category: 'Crime',
          city: 'Manila',
          barangay: 'Ermita',
          location: {
            address: 'Ermita District, Manila',
            lat: 14.5842,
            lng: 120.9822
          },
          description: 'Vehicle break-in reported. Items stolen from parked car.',
          dateReported: '2024-01-14T12:30:00Z',
          dateResolved: '2024-01-14T16:15:00Z',
          resolutionTime: '3h 45m',
          finalStatus: 'Resolved',
          resolutionNotes: 'Investigation completed. Security footage reviewed. Report filed.'
        },
        {
          id: '5',
          reporterName: 'John Denzel Bolito',
          reporterPhone: '+63 917 999 6666',
          reporterEmail: 'john.denzel.bolito@email.com',
          category: 'Fire',
          city: 'Quezon City',
          barangay: 'Cubao',
          location: {
            address: 'Cubao Commercial District, Quezon City',
            lat: 14.6193,
            lng: 121.0568
          },
          description: 'Smoke detected in shopping mall. Fire department dispatched.',
          dateReported: '2024-01-14T11:20:00Z',
          dateResolved: '2024-01-14T13:30:00Z',
          resolutionTime: '2h 10m',
          finalStatus: 'Resolved',
          resolutionNotes: 'Electrical short circuit in store. Fire extinguished. Building inspected and cleared.'
        }
      ],
      categoryStats: [
        { category: 'Crime', count: 78, percentage: 44.3 },
        { category: 'Fire', count: 45, percentage: 25.6 },
        { category: 'Medical', count: 32, percentage: 18.2 },
        { category: 'Traffic', count: 21, percentage: 11.9 }
      ],
      timeStats: [
        { period: '00:00-06:00', count: 12 },
        { period: '06:00-12:00', count: 45 },
        { period: '12:00-18:00', count: 67 },
        { period: '18:00-24:00', count: 52 }
      ]
    }

    // Simulate loading
    setTimeout(() => {
      setAnalyticsData(mockData)
      setLoading(false)
    }, 1000)
  }, [dateRange, categoryFilter])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'dashboard') {
      router.push('/dashboard')
    } else if (tab === 'map') {
      router.push('/map')
    }
  }

  const handleExportData = () => {
    toast.success('Data exported successfully')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crime':
        return 'text-danger-500'
      case 'fire':
        return 'text-orange-500'
      case 'medical':
        return 'text-success-500'
      case 'traffic':
        return 'text-primary-600'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-primary/95 backdrop-blur-md shadow-lg border-b border-white/30 sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-3 shadow-xl ring-2 ring-white/50">
                <span className="text-primary-600 text-base font-bold">C</span>
              </div>
              <h1 className="text-xl font-bold text-white drop-shadow-md">CRASH Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-white/80 hover:text-white relative">
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-white/80">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/80 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        {/* Navigation Tabs */}
        <div className="mb-4">
          <nav className="flex space-x-6">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Home className="h-5 w-5 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => handleTabChange('map')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Map className="h-5 w-5 inline mr-2" />
              Live Map
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="glass-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Reports Analytics
                </h2>
                {/* Toggle Button */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setAnalyticsView('locations')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      analyticsView === 'locations'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Top Locations
                  </button>
                  <button
                    onClick={() => setAnalyticsView('resolved')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      analyticsView === 'resolved'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Resolved Cases
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="input-field"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Categories</option>
                    <option value="crime">Crime</option>
                    <option value="fire">Fire</option>
                    <option value="medical">Medical</option>
                    <option value="traffic">Traffic</option>
                  </select>
                </div>
                <button
                  onClick={handleExportData}
                  className="btn-outline flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional Views Based on Toggle */}
        {analyticsView === 'locations' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Locations */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Locations
              </h3>
              
              <div className="space-y-4">
                {analyticsData?.topLocations.map((location, index) => (
                  <div key={`${location.city}-${location.barangay}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-input">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {location.city}, {location.barangay}
                        </p>
                        <p className="text-xs text-gray-500">
                          {location.count} reports
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {location.percentage.toFixed(1)}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full" 
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Statistics */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Category Statistics
              </h3>
              
              <div className="space-y-4">
                {analyticsData?.categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-input">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        stat.category.toLowerCase() === 'crime' ? 'bg-danger-500' :
                        stat.category.toLowerCase() === 'fire' ? 'bg-orange-500' :
                        stat.category.toLowerCase() === 'medical' ? 'bg-success-500' :
                        'bg-primary-600'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {stat.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {stat.count} reports
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {stat.percentage.toFixed(1)}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            stat.category.toLowerCase() === 'crime' ? 'bg-danger-500' :
                            stat.category.toLowerCase() === 'fire' ? 'bg-orange-500' :
                            stat.category.toLowerCase() === 'medical' ? 'bg-success-500' :
                            'bg-gradient-primary'
                          }`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Resolved Cases View */
          <div className="mt-8">
            <div className="glass-card-strong">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Resolved Cases
                </h3>
                <p className="text-sm text-gray-500">
                  {analyticsData?.resolvedCases.length} resolved cases
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white/50 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Resolved
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resolution Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-200/50">
                    {analyticsData?.resolvedCases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-white/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {case_.reporterName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getCategoryColor(case_.category)}`}>
                            {case_.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {case_.city}, {case_.barangay}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(case_.dateResolved)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-success-500">
                            {case_.resolutionTime}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedResolvedCase(case_)
                              setShowResolvedCaseModal(true)
                            }}
                            className="text-primary-600 hover:text-primary-800 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resolved Case Details Modal */}
      {showResolvedCaseModal && selectedResolvedCase && (
        <ResolvedCaseDetailsModal
          case_={selectedResolvedCase}
          onClose={() => {
            setShowResolvedCaseModal(false)
            setSelectedResolvedCase(null)
          }}
        />
      )}
    </div>
  )
}

export default Analytics

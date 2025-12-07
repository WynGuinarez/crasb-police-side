import {
    BarChart3,
    Bell,
    Calendar,
    CheckCircle,
    Download,
    Filter,
    Home,
    LogOut,
    Map,
    MapPin,
    TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

const Analytics = () => {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab] = useState('analytics')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [barangayFilter, setBarangayFilter] = useState('all')

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Fetch Analytics Data
   * ============================================================================
   * 
   * The backend provides separate endpoints for different analytics data.
   * You'll need to make multiple API calls to get all analytics data.
   * 
   * ENDPOINTS TO CALL:
   * 1. GET /api/analytics/summary/overview/ - Total reports, resolved, avg resolution time
   * 2. GET /api/analytics/hotspots/locations/ - Top locations with most reports
   * 3. GET /api/analytics/hotspots/categories/ - Category statistics
   * 
   * QUERY PARAMETERS (apply to all endpoints):
   * - days: Number (e.g., 7, 30, 90, 365) - Default: 30
   * - scope: "our_office" | "all" - Default: "all"
   * - office_id: UUID (required if scope=our_office)
   * - city: City name (optional)
   * - barangay: Barangay name (optional, requires city)
   * - category: Category name (optional)
   * 
   * EXAMPLE QUERY:
   * /api/analytics/summary/overview/?days=30&scope=our_office&office_id=abc123&category=Robbery
   * 
   * RESPONSE FORMATS:
   * 
   * 1. Overview Summary (GET /api/analytics/summary/overview/):
   * {
   *   "totalReports": 150,
   *   "resolvedReports": 120,
   *   "averageResolutionTime": "2.5 hours",
   *   "pendingReports": 30
   * }
   * 
   * 2. Location Hotspots (GET /api/analytics/hotspots/locations/):
   * [
   *   {
   *     "location": "string",
   *     "city": "string",
   *     "barangay": "string",
   *     "reportCount": 25,
   *     "lat": 14.5995,
   *     "lng": 120.9842
   *   }
   * ]
   * 
   * 3. Category Concentration (GET /api/analytics/hotspots/categories/):
   * [
   *   {
   *     "category": "Robbery",
   *     "count": 45,
   *     "percentage": 30.0
   *   }
   * ]
   * 
   * INTEGRATION STEPS:
   * 1. Build query parameters from filters (dateRange, categoryFilter, cityFilter, barangayFilter)
   * 2. Get auth token from localStorage
   * 3. Make 3 parallel API calls (Promise.all) to get all analytics data
   * 4. Combine responses into analyticsData object
   * 5. Handle errors (401 = unauthorized)
   * 6. Set loading to false after all requests complete
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const params = new URLSearchParams()
   * params.append('days', dateRange)
   * if (categoryFilter !== 'all') params.append('category', categoryFilter)
   * if (cityFilter !== 'all') params.append('city', cityFilter)
   * if (barangayFilter !== 'all' && cityFilter !== 'all') {
   *   params.append('barangay', barangayFilter)
   * }
   * 
   * const queryString = params.toString()
   * const baseUrl = process.env.NEXT_PUBLIC_API_URL
   * 
   * const [overview, locations, categories] = await Promise.all([
   *   fetch(`${baseUrl}/analytics/summary/overview/?${queryString}`, {
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   }),
   *   fetch(`${baseUrl}/analytics/hotspots/locations/?${queryString}`, {
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   }),
   *   fetch(`${baseUrl}/analytics/hotspots/categories/?${queryString}`, {
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   })
   * ])
   * 
   * const overviewData = await overview.json()
   * const locationsData = await locations.json()
   * const categoriesData = await categories.json()
   * 
   * setAnalyticsData({
   *   overview: overviewData,
   *   topLocations: locationsData,
   *   categoryStats: categoriesData,
   *   timeStats: [] // If time stats endpoint exists, add it here
   * })
   * ============================================================================
   */
  useEffect(() => {
    // TODO: REPLACE WITH BACKEND API CALLS
    // BACKEND ENDPOINTS:
    // - GET /api/analytics/summary/overview/
    // - GET /api/analytics/hotspots/locations/
    // - GET /api/analytics/hotspots/categories/
    // See detailed comments above for integration guide
    
    // Load data from temporary database (to be replaced with API calls)
    let topLocations = TemporaryDatabase.analytics.topLocations
    let categoryStats = TemporaryDatabase.analytics.categoryStats
    let timeStats = TemporaryDatabase.analytics.timeStats

    // Apply city filter to top locations if not 'all'
    if (cityFilter !== 'all') {
      topLocations = topLocations.filter(location => location.city === cityFilter)
    }

    // Apply barangay filter to top locations if not 'all' (only when city is selected)
    if (barangayFilter !== 'all' && cityFilter !== 'all') {
      topLocations = topLocations.filter(location => location.barangay === barangayFilter)
    }

    const analyticsData = {
      topLocations,
      categoryStats,
      timeStats
    }
    
    setAnalyticsData(analyticsData)
    setLoading(false)
  }, [dateRange, categoryFilter, cityFilter, barangayFilter])

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Fetch list of Barangays based on the selected City ID.
   * METHOD: GET
   * ENDPOINT: /api/locations/city/{cityId}/barangays
   * 
   * Replace the filter logic on TemporaryDatabase.barangays with the actual API call here.
   * The API should return an array of barangays that belong to the specified city.
   */
  // Get barangays for the selected city
  const getBarangaysForCity = (cityName) => {
    if (cityName === 'all') return []
    
    // Find city ID by name
    const city = TemporaryDatabase.cities.find(c => c.name === cityName)
    if (!city) return []
    
    // TODO: Replace with API call: GET /api/locations/city/${city.id}/barangays
    // Filter barangays by cityId
    return TemporaryDatabase.barangays.filter(b => b.cityId === city.id)
  }

  // Reset barangay filter when city changes
  useEffect(() => {
    if (cityFilter === 'all') {
      setBarangayFilter('all')
    }
  }, [cityFilter])

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

  const handleExportData = () => {
    /*
     * TODO: API INTEGRATION POINT
     * ACTION: Export analytics data in a specified format (CSV, PDF, etc.).
     * METHOD: GET
     * ENDPOINT: /api/analytics/export
     * 
     * Query parameters:
     * - dateRange: string
     * - categoryFilter: string
     * - cityFilter: string
     * - barangayFilter: string
     * - format: string (e.g., 'csv', 'pdf', 'xlsx')
     * 
     * Response: File download or URL to download the file.
     */
    // TODO: Replace with API call: GET /api/analytics/export?dateRange=${dateRange}&categoryFilter=${categoryFilter}&cityFilter=${cityFilter}&barangayFilter=${barangayFilter}&format=csv
    toast.success('Data exported successfully')
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

      <div className="w-full max-w-7xl mx-auto px-6 py-4 pt-20">
        {/* Navigation Tabs */}
        <div className="mb-4">
          <nav className="flex space-x-6">
            <Link
              href="/dashboard"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Home className="h-5 w-5 inline mr-2" />
              Dashboard
            </Link>
            <Link
              href="/map"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Map className="h-5 w-5 inline mr-2" />
              Live Map
            </Link>
            <Link
              href="/analytics"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Analytics
            </Link>
            <Link
              href="/resolved-cases"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resolved-cases' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <CheckCircle className="h-5 w-5 inline mr-2" />
              Resolved Cases
            </Link>
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
              </div>
              <div className="flex items-center space-x-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="input-field"
                  >
                    {TemporaryDatabase.dateRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
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
                    {TemporaryDatabase.reportCategories.map(category => (
                      <option key={category.toLowerCase()} value={category.toLowerCase()}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Cities</option>
                    {TemporaryDatabase.cities.map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
                {cityFilter !== 'all' && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={barangayFilter}
                      onChange={(e) => setBarangayFilter(e.target.value)}
                      className="input-field"
                    >
                      <option value="all">All Barangays</option>
                      {getBarangaysForCity(cityFilter).map(barangay => (
                        <option key={barangay.id} value={barangay.name}>{barangay.name}</option>
                      ))}
                    </select>
                  </div>
                )}
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

        {/* Analytics Content - Top Locations and Category Statistics */}
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
      </div>

    </div>
  )
}

export default Analytics


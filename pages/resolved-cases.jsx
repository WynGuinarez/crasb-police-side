import {
  BarChart3,
  Bell,
  CheckCircle,
  Download,
  Home,
  LogOut,
  Map,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ResolvedCaseDetailsModal from '../components/ResolvedCaseDetailsModal'
import { useAuth } from '../contexts/AuthContext'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

const ResolvedCases = () => {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab] = useState('resolved-cases')
  const [resolvedCases, setResolvedCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [barangayFilter, setBarangayFilter] = useState('all')
  const [showResolvedCaseModal, setShowResolvedCaseModal] = useState(false)
  const [selectedResolvedCase, setSelectedResolvedCase] = useState(null)

  /*
   * ============================================================================
   * BACKEND INTEGRATION: Fetch Resolved Cases
   * ============================================================================
   * 
   * BACKEND ENDPOINT: GET /api/reports/resolved/
   * 
   * QUERY PARAMETERS:
   * - days: Number (e.g., 7, 30, 90, 365) - Default: 30
   * - scope: "our_office" | "all" - Default: "all"
   * - office_id: UUID (required if scope=our_office)
   * - city: City name (optional)
   * - barangay: Barangay name (optional, requires city)
   * - category: Category name (optional)
   * 
   * EXAMPLE QUERY:
   * /api/reports/resolved/?days=30&scope=our_office&office_id=abc123&category=Robbery&city=Manila
   * 
   * AUTHENTICATION:
   * - Include JWT token in Authorization header: "Bearer {token}"
   * 
   * EXPECTED RESPONSE (200):
   * [
   *   {
   *     "id": "uuid",
   *     "reporterName": "string",
   *     "category": "string",
   *     "status": "resolved",
   *     "location": {
   *       "city": "string",
   *       "barangay": "string",
   *       "address": "string",
   *       "lat": number,
   *       "lng": number
   *     },
   *     "timestamp": "2024-01-01T12:00:00Z",
   *     "resolvedAt": "2024-01-01T14:30:00Z",
   *     "resolutionTime": "2.5 hours",
   *     "description": "string",
   *     "attachments": ["url1", "url2"]
   *   }
   * ]
   * 
   * INTEGRATION STEPS:
   * 1. Build query parameters from filters (dateRange, categoryFilter, cityFilter, barangayFilter)
   * 2. Get auth token from localStorage
   * 3. Make GET request to: ${process.env.NEXT_PUBLIC_API_URL}/reports/resolved/
   * 4. Include Authorization header
   * 5. Parse response JSON and set to resolvedCases state
   * 6. Handle errors (401 = unauthorized)
   * 7. Set loading to false after request completes
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
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/reports/resolved/?${params.toString()}`,
   *   {
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   }
   * )
   * if (response.ok) {
   *   const data = await response.json()
   *   setResolvedCases(data)
   * } else if (response.status === 401) {
   *   router.push('/login')
   * }
   * setLoading(false)
   * ============================================================================
   */
  useEffect(() => {
    // TODO: REPLACE WITH BACKEND API CALL
    // BACKEND ENDPOINT: GET /api/reports/resolved/
    // See detailed comments above for integration guide
    
    // Load data from temporary database (to be replaced with API call)
    let cases = TemporaryDatabase.analytics.resolvedCases

    // Apply category filter if not 'all'
    if (categoryFilter !== 'all') {
      cases = cases.filter(case_ => case_.category.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Apply city filter if not 'all'
    if (cityFilter !== 'all') {
      cases = cases.filter(case_ => case_.city === cityFilter)
    }

    // Apply barangay filter if not 'all' (only when city is selected)
    if (barangayFilter !== 'all' && cityFilter !== 'all') {
      cases = cases.filter(case_ => case_.barangay === barangayFilter)
    }

    // Apply date range filter (simplified - in real API, this would be handled server-side)
    // TODO: Date range filtering should be handled by the API endpoint
    setResolvedCases(cases)
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

  /*
   * TODO: API INTEGRATION POINT - INDIVIDUAL CASE EXPORT
   * ACTION: Request the server to generate and return the report (e.g., PDF/CSV)
   * for the specific Resolved Case ID.
   * METHOD: GET (or POST if report generation is complex/synchronous)
   * ENDPOINT: /api/cases/{caseId}/export
   * 
   * Query parameters (optional):
   * - format: string (e.g., 'pdf', 'csv', 'xlsx') - default: 'pdf'
   * 
   * The API should return the file as a download (Content-Disposition header)
   * or return a URL to download the generated report.
   */
  /*
   * ============================================================================
   * BACKEND INTEGRATION: Export Single Resolved Case (PDF)
   * ============================================================================
   * 
   * BACKEND ENDPOINT: GET /api/reports/{report_id}/export/
   * 
   * NOTE: The report_id should be a UUID format
   * Example: /api/reports/a1b2c3d4-e5f6-7890-1234-567890abcdef/export/
   * 
   * AUTHENTICATION:
   * - Include JWT token in Authorization header: "Bearer {token}"
   * 
   * EXPECTED RESPONSE (200):
   * - Content-Type: application/pdf
   * - Binary PDF file data
   * 
   * INTEGRATION STEPS:
   * 1. Get auth token from localStorage
   * 2. Make GET request to: ${process.env.NEXT_PUBLIC_API_URL}/reports/${caseId}/export/
   * 3. Include Authorization header
   * 4. Set response type to 'blob' to handle binary PDF data
   * 5. Create a download link from the blob
   * 6. Trigger download programmatically
   * 7. Clean up the blob URL after download
   * 8. Show success toast notification
   * 9. Handle errors (401 = unauthorized, 404 = case not found)
   * 
   * EXAMPLE IMPLEMENTATION:
   * const token = localStorage.getItem('auth_token')
   * const response = await fetch(
   *   `${process.env.NEXT_PUBLIC_API_URL}/reports/${caseId}/export/`,
   *   {
   *     headers: { 'Authorization': `Bearer ${token}` }
   *   }
   * )
   * if (response.ok) {
   *   const blob = await response.blob()
   *   const url = window.URL.createObjectURL(blob)
   *   const a = document.createElement('a')
   *   a.href = url
   *   a.download = `case-${caseId}.pdf`
   *   document.body.appendChild(a)
   *   a.click()
   *   window.URL.revokeObjectURL(url)
   *   document.body.removeChild(a)
   *   toast.success('Case report exported successfully')
   * } else {
   *   toast.error('Failed to export case report')
   * }
   * ============================================================================
   */
  const handleExportCase = (caseId) => {
    // TODO: REPLACE WITH BACKEND API CALL
    // BACKEND ENDPOINT: GET /api/reports/{report_id}/export/
    // See detailed comments above for integration guide
    
    toast.success('Exporting case report...')
    // TODO: Replace with API call: GET /api/cases/${caseId}/export?format=pdf
    // Example implementation:
    // const response = await fetch(`/api/cases/${caseId}/export?format=pdf`, {
    //   method: 'GET',
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // const blob = await response.blob()
    // const url = window.URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = `case-${caseId}-report.pdf`
    // document.body.appendChild(a)
    // a.click()
    // window.URL.revokeObjectURL(url)
    // document.body.removeChild(a)
    
    // Show success notification
    toast.success(`Exporting case report for case ID: ${caseId}`)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'crime':
        return 'text-red-600'
      case 'fire':
        return 'text-orange-600'
      case 'medical':
        return 'text-green-600'
      case 'traffic':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
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
                  Resolved Cases
                </h2>
              </div>
              <div className="flex items-center space-x-4 flex-wrap">
                <div className="flex items-center space-x-2">
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
              </div>
            </div>
          </div>
        </div>

        {/* Resolved Cases Table */}
        <div className="mt-8">
          <div className="glass-card-strong">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Resolved Cases
              </h3>
              <p className="text-sm text-gray-500">
                {resolvedCases.length} resolved cases
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
                  {resolvedCases.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No resolved cases found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    resolvedCases.map((case_) => (
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
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => {
                                setSelectedResolvedCase(case_)
                                setShowResolvedCaseModal(true)
                              }}
                              className="text-primary-600 hover:text-primary-800 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleExportCase(case_.id)}
                              className="text-green-600 hover:text-green-800 transition-colors flex items-center"
                              title="Export case report"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

export default ResolvedCases


import {
    AlertTriangle,
    BarChart3,
    Bell,
    CheckCircle,
    Clock,
    Eye,
    Home,
    LogOut,
    Map,
    MapPin,
    MessageSquare,
    Navigation,
    User
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DirectionsModal from '../components/DirectionsModal'
import ReportDetailsModal from '../components/ReportDetailsModal'
import ReportChatModal from '../components/ReportChatModal'
import { useAuth } from '../contexts/AuthContext'
import { TemporaryDatabase } from '../lib/TemporaryDatabase'

interface Report {
  id: string
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  city: string
  barangay: string
  category: string
  status: 'pending' | 'acknowledged' | 'en-route' | 'resolved' | 'canceled'
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  attachments: string[]
  emergencyContact: {
    name: string
    phone: string
  }
  timestamp: string
  distance?: string // Distance from police station to report location (e.g., "5.4 km")
  eta?: string // Estimated time of arrival (e.g., "12 mins")
}

const Dashboard = () => {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showDirectionsModal, setShowDirectionsModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [newReportAlert, setNewReportAlert] = useState(false)

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Fetch the list of all active reports/cases for the dashboard.
   * METHOD: GET
   * ENDPOINT: /api/reports/active
   * 
   * Replace the call to TemporaryDatabase.activeReports with the actual API call here.
   * Expected response format should match the Report[] interface.
   */
  useEffect(() => {
    // Load data from temporary database (to be replaced with API call)
    const activeReports = TemporaryDatabase.activeReports
    setReports(activeReports)
    setLoading(false)

    /*
     * TODO: API INTEGRATION POINT
     * ACTION: Listen for new report notifications/alerts.
     * METHOD: WebSocket or Server-Sent Events (SSE)
     * ENDPOINT: /api/reports/notifications (WebSocket) or /api/reports/stream (SSE)
     * 
     * Replace the polling mechanism with WebSocket or SSE for real-time notifications.
     * This will provide instant alerts when new reports are received.
     */
    // Simulate new report alert (to be replaced with WebSocket/SSE)
    const alertInterval = setInterval(() => {
      // TODO: Replace with WebSocket/SSE connection for real-time notifications
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        setNewReportAlert(true)
        toast.success('🚨 New CRASH Report Received!', {
          duration: 5000,
          icon: '🚨'
        })
      }
    }, 5000)

    return () => clearInterval(alertInterval)
  }, [])

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
    // Use router.push with shallow routing for faster navigation
    if (tab === 'map') {
      router.push('/map', undefined, { shallow: false })
    } else if (tab === 'analytics') {
      router.push('/analytics', undefined, { shallow: false })
    }
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const handleViewDirections = (report: Report) => {
    setSelectedReport(report)
    setShowDirectionsModal(true)
  }

  const handleOpenChat = (report: Report) => {
    setSelectedReport(report)
    setShowChatModal(true)
  }

  const handleCloseChat = () => {
    setShowChatModal(false)
    setSelectedReport(null)
  }

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Update the status of a specific report/case.
   * METHOD: PATCH
   * ENDPOINT: /api/reports/:reportId/status
   * 
   * Replace the local state update with an API call here.
   * The API should accept: { status: string } in the request body.
   */
  const handleStatusChange = (reportId: string, newStatus: Report['status']) => {
    // TODO: Replace with API call: PATCH /api/reports/${reportId}/status
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ))
    toast.success('Status updated successfully')
  }

  /*
   * TODO: API INTEGRATION POINT
   * ACTION: Update distance and ETA information for a specific report.
   * METHOD: PATCH
   * ENDPOINT: /api/reports/:reportId/distance-eta
   * 
   * Replace the local state update with an API call here.
   * The API should accept: { distance: string, eta: string } in the request body.
   */
  const handleDistanceEtaUpdate = (reportId: string, distance: string, eta: string) => {
    // TODO: Replace with API call: PATCH /api/reports/${reportId}/distance-eta
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, distance, eta } : report
    ))
    // Update selectedReport if it's the same report
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, distance, eta } : null)
    }
  }

  const getStatusBadge = (status: Report['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'status-pending' },
      acknowledged: { label: 'Acknowledged', className: 'status-acknowledged' },
      'en-route': { label: 'En Route', className: 'status-en-route' },
      resolved: { label: 'Resolved', className: 'status-resolved' },
      canceled: { label: 'Canceled', className: 'status-canceled' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crime':
        return <AlertTriangle className="h-4 w-4 text-danger-500" />
      case 'fire':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medical':
        return <AlertTriangle className="h-4 w-4 text-success-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
                  {newReportAlert && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse ring-2 ring-red-400/50"></span>
                  )}
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

      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex-1 pt-20">
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
              <Home className="h-4 w-4 inline mr-2" />
              Dashboard
            </Link>
            <Link
              href="/map"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'map' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <Map className="h-4 w-4 inline mr-2" />
              Live Map
            </Link>
            <Link
              href="/analytics"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </Link>
            <Link
              href="/resolved-cases"
              prefetch={true}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resolved-cases' ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Resolved Cases
            </Link>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card hover:bg-white/85 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-status-pending-100 rounded-lg">
                  <Clock className="h-7 w-7 text-status-pending-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-status-pending-700">Pending</p>
                  <p className="text-2xl font-bold text-status-pending-700">
                    {reports.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card hover:bg-white/85 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-status-acknowledged-100 rounded-lg">
                  <Eye className="h-7 w-7 text-status-acknowledged-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-status-acknowledged-700">Acknowledged</p>
                  <p className="text-2xl font-bold text-status-acknowledged-700">
                    {reports.filter(r => r.status === 'acknowledged').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card hover:bg-white/85 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-status-enroute-100 rounded-lg">
                  <Navigation className="h-7 w-7 text-status-enroute-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-status-enroute-700">En Route</p>
                  <p className="text-2xl font-bold text-status-enroute-700">
                    {reports.filter(r => r.status === 'en-route').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card hover:bg-white/85 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-status-resolved-100 rounded-lg">
                  <CheckCircle className="h-7 w-7 text-status-resolved-600" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-status-resolved-700">Resolved</p>
                  <p className="text-2xl font-bold text-status-resolved-700">
                    {reports.filter(r => r.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Reports Table */}
          <div className="glass-card-strong">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Active Reports</h2>
              <div className="text-xs font-medium text-gray-600">
                {reports.length} total reports
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white/60 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/30 divide-y divide-gray-200/50">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {report.reporterName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.reporterPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {getCategoryIcon(report.category)}
                          <span className="ml-2 text-sm text-gray-900">
                            {report.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {report.city}, {report.barangay}
                            </div>
                            <div className="text-xs text-gray-500">
                              {report.location.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {formatTimestamp(report.timestamp)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="text-primary-600 hover:text-primary-800 flex items-center"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleViewDirections(report)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Navigation className="h-3 w-3 mr-1" />
                            Directions
                          </button>
                          <button
                            onClick={() => handleOpenChat(report)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Open Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReportModal && selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setShowReportModal(false)}
          onStatusChange={handleStatusChange}
          onDistanceEtaUpdate={handleDistanceEtaUpdate}
        />
      )}

      {showDirectionsModal && selectedReport && (
        <DirectionsModal
          report={selectedReport}
          onClose={() => setShowDirectionsModal(false)}
          onDistanceEtaUpdate={handleDistanceEtaUpdate}
        />
      )}

      {showChatModal && selectedReport && user && (
        <ReportChatModal
          report={selectedReport}
          userId={user.id}
          onClose={handleCloseChat}
        />
      )}
    </div>
  )
}

export default Dashboard
